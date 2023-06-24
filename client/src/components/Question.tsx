import { XMarkIcon, CameraIcon } from "@heroicons/react/24/solid";
import { Textarea } from "./ui/textarea";
import { useRef, useEffect } from "react";
import Answer from "./Answer";
import { Button } from "./ui/button";
import { QuestionType } from "../types/models";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../components/ui/alertDialog";
import ImageUpload from "./ImageUpload";

interface Props {
	question: QuestionType;
	questionIndex: number;
	onSetQuestionImage: (imageUrl: string | undefined, questionIndex: number) => void;
	onQuestionChange: (text: string, questionIndex: number) => void;
	onQuestionDelete: (questionIndex: number) => void;
	onAnswerAdd: (questionIndex: number) => void;
	onAnswerChange: (text: string, answerIndex: number, questionIndex: number) => void;
	onAnswerDelete: (answerIndex: number, questionIndex: number) => void;
	toggleAnswerCorrect: (answerIndex: number, questionIndex: number) => void;
}

const Question = ({
	question,
	questionIndex,
	onSetQuestionImage,
	onQuestionChange,
	onQuestionDelete,
	onAnswerChange,
	onAnswerDelete,
	onAnswerAdd,
	toggleAnswerCorrect,
}: Props) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

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
		<div className=" bg-slate-200 w-full p-5">
			<div className="flex flex-col gap-5 max-w-4xl mx-auto pt-10 pb-10">
				<div className="flex justify-between">
					<h1 className="flex gap-3 items-center text-2xl font-bold">
						<AlertDialog>
							<AlertDialogTrigger>
								<div className="bg-transparent border border-dashed border-slate-400 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 py-2 px-4">
									{question.imageUrl ? (
										<img src={`${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${question.imageUrl}`} className="w-[40px] h-full" />
									) : (
										<CameraIcon className="text-slate-400 h-7 w-7" />
									)}
								</div>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Upload an image</AlertDialogTitle>
                  <ImageUpload
                    onSetQuestionImage={onSetQuestionImage}
                    imageUrl={question.imageUrl}
                    questionIndex={questionIndex}
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
					<XMarkIcon
						className="text-slate-400 h-7 w-7 cursor-pointer hover:text-red-600"
						onClick={() => onQuestionDelete(questionIndex)}
					/>
				</div>
				<Textarea
					ref={textareaRef}
					className="bg-primary text-lg p-5 overflow-hidden resize-none"
					onChange={(e) => onQuestionChange(e.target.value, questionIndex)}
					placeholder="Insert question..."
					value={question.question}
				/>
				<div className="flex flex-col gap-2">
					{question.answers.map((answer, answerIndex) => {
						let label = String.fromCharCode(65 + answerIndex);
						return (
							<Answer
								key={answerIndex}
								answerIndex={answerIndex}
								questionIndex={questionIndex}
								label={label}
								answer={answer}
								onAnswerChange={onAnswerChange}
								onAnswerDelete={onAnswerDelete}
								toggleAnswerCorrect={toggleAnswerCorrect}
							/>
						);
					})}
				</div>
				<div className="flex justify-end">
					<Button
						variant="ghost"
						className="text-blue-500 font-bold text-lg hover:bg-slate-100 hover:text-blue-500"
						onClick={() => onAnswerAdd(questionIndex)}
					>
						Add answer +
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Question;
