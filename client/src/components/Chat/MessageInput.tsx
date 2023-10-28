import { FilePlus2Icon, ImagePlusIcon, PlusCircleIcon, SendIcon, TrashIcon } from "lucide-react";
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
import { removeFileFromBucket } from "../../utils/supabaseUtils";
import { useToast } from "../../hooks/useToast";
import { MessageType, OptionType } from "../../../../shared/models";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { fetchTestsByUserId } from "../../api/tests";
import { useSession } from "@clerk/clerk-react";

const schema = z.object({
	messageContent: z.string().min(1),
	fileUrl: z.string().optional(),
	testId: z.string().optional(),
});

const MessageInput = () => {
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [fileType, setFileType] = useState<"image" | "document">("image");
	const [filePath, setFilePath] = useState<string | undefined>();
	const [selectedTest, setSelectedTest] = useState<OptionType | undefined>();
	const [testOptions, setTestOptions] = useState<OptionType[]>();
	const { session } = useSession();
	const userId = session?.user.id;
	const { toast } = useToast();

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

	const { register, handleSubmit, setValue } = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	});

	const handleOpenFileDialog = (value: "image" | "document") => {
		setFileType(value);
		setIsDialogOpen(true);
	};

	const handleRemoveFile = async () => {
		if (filePath) {
			await removeFileFromBucket("questionImages", filePath)
				.then(() => {
					setFilePath(undefined);
					setValue("fileUrl",undefined)
				})
				.catch(() => {
					toast({
						title: "😓 Failed to remove the file",
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
		};

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
				className="relative flex flex-col w-full max-w-4xl gap-2 p-2 mx-auto mt-auto bg-gray-900 rounded-sm"
				onSubmit={handleSubmit(onSubmit)}
			>
				{filePath && (
					<div className="flex w-full gap-1 p-2 text-xs border rounded-sm -top-10">
						<TrashIcon
							className="w-4 h-4 cursor-pointer hover:text-red-500"
							onClick={() => handleRemoveFile()}
						/>
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
				<div className="flex gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								className="self-end"
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

					<Textarea className="resize-none" {...register("messageContent")} />

					<Button
						className="self-end bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700"
						type="submit"
					>
						<SendIcon className="w-6 h-6 " />
					</Button>
				</div>
			</form>
		</>
	);
};

export default MessageInput;
