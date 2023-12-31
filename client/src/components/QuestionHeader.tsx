import { useSession } from "@clerk/clerk-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/Dialogs/AlertDialog";
import { Check, ImageIcon, SettingsIcon, XIcon } from "lucide-react";
import { useToast } from "../hooks/useToast";
import { QuestionType, QuestionVariantsType } from "../../../shared/models";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/Dropdown";
import { Textarea } from "./ui/Textarea";
import { useEffect, useRef } from "react";
import FileUpload from "./FileUpload";

interface optionsProps {
	value: QuestionVariantsType;
	label: string;
}

const options: optionsProps[] = [
	{
		value: "CODE",
		label: "Code",
	},
	{
		value: "MULTIPLE_CHOICE",
		label: "Multiple Choice",
	},
];

interface Props {
	question: QuestionType;
	questionIndex: number;
	onQuestionChange: (text: string, questionID: string) => void
	onQuestionDelete: (questionID: string) => void;
	onSetQuestionImage: (imageUrl: string | undefined, questionID: string) => void;
	onQuestionTypeChange: (value: QuestionVariantsType, questionIndex: number) => void;
}

const QuestionHeader = ({
	question,
	questionIndex,
	onQuestionChange,
	onQuestionDelete,
	onSetQuestionImage,
	onQuestionTypeChange,
}: Props) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { isSignedIn } = useSession();
	const { toast } = useToast();

	const handleOpenImageModal = () => {
		if (!isSignedIn) {
			toast({
				title: "Login required",
				description: "Please login in order to add images.",
				variant: "destructive",
			});
		}
	};

	const handleSetImage = (imageUrl:string | undefined) => {
		onSetQuestionImage(imageUrl,question.id)
	}

	useEffect(() => {
		const textarea = textareaRef.current;

		if (textarea) {
			const adjustTextareaHeight = () => {
				textarea.style.height = "auto";
				textarea.style.height = `${textarea.scrollHeight}px`;
			};

			textarea.addEventListener("input", adjustTextareaHeight);
			return () => {
				textarea.removeEventListener("input", adjustTextareaHeight);
			};
		}
	}, []);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex justify-between">
				<h1 className="flex items-center gap-3 text-2xl font-bold">
					<AlertDialog>
						<AlertDialogTrigger disabled={!isSignedIn}>
							<div
								className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors bg-transparent border border-dashed rounded-md border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
								onClick={handleOpenImageModal}
							>
								{question.imageUrl ? (
									<img
										src={`${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${question.imageUrl}`}
										className="w-[40px] h-full"
									/>
								) : (
									<ImageIcon className="transition-all text-slate-400 h-7 w-7 hover:text-blue-500" />
								)}
							</div>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Upload an image</AlertDialogTitle>
								<FileUpload
									onSetFilePath={handleSetImage}
									defaultFilePath={question.imageUrl!}
									fileType="image"
								/>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Close</AlertDialogCancel>
								<AlertDialogAction
									className="bg-blue-500 hover:bg-blue-600"
									disabled={question.imageUrl ? false : true}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
					Question {questionIndex + 1}
				</h1>
				<div className="flex items-center gap-1">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<SettingsIcon className="cursor-pointer text-slate-400 h-7 w-7 hover:text-blue-500" />
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-[200px] flex flex-col gap-1">
							<DropdownMenuLabel>Question Type</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{options.map((option) => (
								<DropdownMenuItem
									key={option.value}
									className={`${
										option.value === question.type && "bg-slate-100 dark:bg-slate-800 mb-1"
									} hover:bg-slate-200 dark:hover:bg-gray-800`}
									onClick={() => onQuestionTypeChange(option.value, questionIndex)}
								>
									{option.value === question.type && <Check className="w-4 h-4 mr-2" />}{" "}
									{option.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					<XIcon
						className="cursor-pointer text-slate-400 h-7 w-7 hover:text-red-600"
						onClick={() => onQuestionDelete(question.id)}
					/>
				</div>
			</div>
			<Textarea
				ref={textareaRef}
				className="p-5 overflow-hidden text-lg resize-none "
				onChange={(e) => onQuestionChange(e.target.value, question.id)}
				placeholder="Insert question..."
				value={question.question}
			/>
		</div>
	);
};

export default QuestionHeader;
