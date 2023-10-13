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
import ImageUpload from "./ImageUpload";
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

interface optionsProps {
	value: QuestionVariantsType["type"];
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
	onQuestionTypeChange: (value: QuestionVariantsType["type"], questionIndex: number) => void;
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
				<h1 className="flex gap-3 items-center text-2xl font-bold">
					<AlertDialog>
						<AlertDialogTrigger disabled={!isSignedIn}>
							<div
								className="bg-transparent border border-dashed border-slate-400 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 py-2 px-4"
								onClick={handleOpenImageModal}
							>
								{question.imageUrl ? (
									<img
										src={`${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${question.imageUrl}`}
										className="w-[40px] h-full"
									/>
								) : (
									<ImageIcon className="text-slate-400 h-7 w-7 hover:text-blue-500 transition-all" />
								)}
							</div>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Upload an image</AlertDialogTitle>
								<ImageUpload
									onSetQuestionImage={onSetQuestionImage}
									imageUrl={question.imageUrl}
									questionID={question.id}
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
				<div className="flex gap-1 items-center">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<SettingsIcon className="text-slate-400 h-7 w-7 cursor-pointer hover:text-blue-500" />
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
									{option.value === question.type && <Check className="h-4 w-4 mr-2" />}{" "}
									{option.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					<XIcon
						className="text-slate-400 h-7 w-7 cursor-pointer hover:text-red-600"
						onClick={() => onQuestionDelete(question.id)}
					/>
				</div>
			</div>
			<Textarea
				ref={textareaRef}
				className=" text-lg p-5 overflow-hidden resize-none"
				onChange={(e) => onQuestionChange(e.target.value, question.id)}
				placeholder="Insert question..."
				value={question.question}
			/>
		</div>
	);
};

export default QuestionHeader;
