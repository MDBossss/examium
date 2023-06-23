import { XMarkIcon, Bars4Icon } from "@heroicons/react/24/solid";
import { Textarea } from "./ui/textarea";
import { useRef, useEffect } from "react";
import Answer from "./Answer";
import { Button } from "./ui/button";
import { QuestionType } from "../types/models";

interface Props {
	question: QuestionType;
	questionIndex: number;
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
						<Bars4Icon className="text-slate-400 h-7 w-7" /> Question {questionIndex + 1}
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
