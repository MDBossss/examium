import { FileIcon, FilePlus2Icon, ImagePlusIcon, PlusCircleIcon, SendIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "../ui/Dropdown";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../ui/Dialogs/AlertDialog";
import FileUpload from "../FileUpload";
import { removeFilesFromBucket } from "../../utils/supabaseUtils";
import { useToast } from "../../hooks/useToast";
import { MessageType, OptionType } from "../../../../shared/models";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { fetchTestsByUserId } from "../../api/tests";
import { useSession } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { createMessage } from "../../api/messages";
import { getFullFileUrl } from "../../utils/fileUtils";

const schema = z.object({
	messageContent: z.string().min(1),
	fileUrl: z.string().optional(),
	testId: z.string().optional(),
});

interface Props{
	setIsFileSelected: (value:boolean) => void;
}

const ChatInput = ({setIsFileSelected}:Props) => {
	const { id } = useParams();
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [fileType, setFileType] = useState<"image" | "document">("image");
	const [filePath, setFilePath] = useState<string | undefined>();
	const [selectedTest, setSelectedTest] = useState<OptionType | undefined>();
	const [testOptions, setTestOptions] = useState<OptionType[]>();
	const { session } = useSession();
	const userId = session?.user.id;
	const { toast } = useToast();

	const isImageUploaded = filePath && fileType === "image";
	const isDocumentUploaded = filePath && fileType === "document";

	useQuery({
		queryKey: ["tests", userId],
		queryFn: () => fetchTestsByUserId(userId!),
		refetchOnWindowFocus: false,
		onSuccess: (data) => {
			const newTestOptions: OptionType[] = [];
			data.map((test) => {
				newTestOptions.push({ label: test.title, value: test.id });
			});
			setTestOptions(newTestOptions);
		},
	});

	const { register, handleSubmit, setValue, reset } = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	});

	const handleOpenFileDialog = (value: "image" | "document") => {
		setFileType(value);
		setIsDialogOpen(true);
	};

	const handleRemoveFile = async () => {
		if (filePath) {
			await removeFilesFromBucket("questionImages", [filePath])
				.then(() => {
					setFilePath(undefined);
					setValue("fileUrl", undefined);
					setIsFileSelected(false)
				})
				.catch(() => {
					toast({
						title: "😓 Failed to remove the file",
						description: "Please try again.",
						variant: "destructive",
					});
				});
		}
	};

	const handleRemoveTest = () => {
		if (selectedTest) {
			setValue("testId", undefined);
			setSelectedTest(undefined);
		}
	};

	const handleFileUploaded = (path: string | undefined) => {
		setValue("fileUrl", path);
		setFilePath(path);
		setIsFileSelected(true)
	};

	const handleSetTest = (testOption: OptionType) => {
		setValue("testId", testOption.value);
		setSelectedTest(testOption);
	};

	const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
		const message: MessageType = {
			id: uuidv4(),
			content: data.messageContent,
			fileUrl: data.fileUrl,
			testId: data.testId,
			deleted: false,
			studyGroupId: id,
		};
		await createMessage(message, userId!)
			.then(() => {
				reset();
				setSelectedTest(undefined);
				setFilePath(undefined);
				setIsFileSelected(false)
			})
			.catch(() => {
				toast({
					title: "😓 Failed to send message",
					description: "Please try again.",
					variant: "destructive",
				});
			});
	};

	return (
		<>
			<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Upload a file</AlertDialogTitle>
						<FileUpload
							onSetFilePath={handleFileUploaded}
							defaultFilePath={filePath}
							fileType={fileType}
						/>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Close</AlertDialogCancel>
						<AlertDialogAction
							className="bg-blue-500 hover:bg-blue-600"
							disabled={filePath ? false : true}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<form
				className="relative flex flex-col w-full gap-2 rounded-sm sm:p-2 bg-slate-300 dark:bg-gray-900"
				onSubmit={handleSubmit(onSubmit)}
			>
				{isDocumentUploaded && (
					<div className="flex items-center w-full gap-1 p-2 text-xs border rounded-sm -top-10">
					<div className="relative flex items-center w-20 h-20 rounded-sm aspect-square">
						<TrashIcon
							className="absolute top-0 right-0 w-6 h-6 p-1 rounded-full cursor-pointer bg-background hover:text-red-500 "
							onClick={() => handleRemoveFile()}
						/>
						<FileIcon className="flex-1 object-cover w-16 h-16"/>
					</div>
					{filePath.substring(14)}
				</div>
				)}

				{isImageUploaded && (
					<div className="flex items-center w-full gap-1 p-2 text-xs border rounded-sm -top-10">
						<div className="relative flex w-20 h-20 rounded-sm aspect-square">
							<TrashIcon
								className="absolute top-0 right-0 w-6 h-6 p-1 rounded-full cursor-pointer bg-background hover:text-red-500 "
								onClick={() => handleRemoveFile()}
							/>
							<img src={getFullFileUrl(filePath)} alt="uploaded" className="flex-1 object-cover w-full"/>
						</div>
						{filePath.substring(14)}
					</div>
				)}

				{selectedTest && (
					<div className="flex w-full gap-1 p-2 text-xs border rounded-sm -top-10">
						<TrashIcon
							className="w-4 h-4 cursor-pointer hover:text-red-500"
							onClick={() => handleRemoveTest()}
						/>
						{selectedTest.label}
					</div>
				)}
				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								className="self-end p-0 aspect-square"
								type="button"
								disabled={filePath || selectedTest ? true : false}
							>
								<PlusCircleIcon className="w-6 h-6 " />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="left-0 w-56 -bottom-0" side="top" sticky="always">
							<DropdownMenuLabel>Attach files</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem onClick={() => handleOpenFileDialog("image")}>
									<ImagePlusIcon className="w-4 h-4 mr-2" />
									<span>Upload image</span>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleOpenFileDialog("document")}>
									<FilePlus2Icon className="w-4 h-4 mr-2" />
									<span>Upload document</span>
								</DropdownMenuItem>
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>
										<FilePlus2Icon className="w-4 h-4 mr-2" />
										<span>Share test</span>
									</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent>
											{testOptions?.map((test) => (
												<DropdownMenuItem key={test.value} onClick={() => handleSetTest(test)}>
													<span>{test.label}</span>
												</DropdownMenuItem>
											))}
										</DropdownMenuSubContent>
									</DropdownMenuPortal>
								</DropdownMenuSub>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>

					<Textarea className="overflow-y-auto resize-none h-[40px] md:h-min " {...register("messageContent")}/>

					<Button
						className="self-end p-0 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 aspect-square"
						type="submit"
					>
						<SendIcon className="w-6 h-6 " />
					</Button>
				</div>
			</form>
		</>
	);
};

export default ChatInput;
