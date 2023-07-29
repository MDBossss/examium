import { useEffect, useRef } from "react";
import { MultipleChoiceQuestionType, QuestionType } from "../types/models";
import Answer from "./Answer";
import { Button } from "./ui/Button";
import { Textarea } from "./ui/Textarea";

interface Props{
    question: QuestionType,
    questionIndex: number,
    onQuestionChange: (text: string, questionID: string) => void,
    onAnswerAdd: (questionID: string) => void,
    onAnswerChange: (text: string, questionIndex: number, answerIndex: number) => void,
    onAnswerDelete: (questionID: string, answerID: string) => void,
    toggleAnswerCorrect: (questionID: string, answerID: string) => void
}


const MultipleChoiceQuestionContent = ({question,questionIndex,onQuestionChange,onAnswerAdd,onAnswerChange,onAnswerDelete,toggleAnswerCorrect}:Props) => {

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
    <>
    <Textarea
					ref={textareaRef}
					className="bg-primary text-lg p-5 overflow-hidden resize-none"
					onChange={(e) => onQuestionChange(e.target.value, question.id)}
					placeholder="Insert question..."
					value={question.question}
				/>
				<div className="flex flex-col gap-2">
					{(question as MultipleChoiceQuestionType).answers.map((answer, answerIndex) => {
						let label = String.fromCharCode(65 + answerIndex);
						return (
							<Answer
								key={answer.id}
								answerIndex={answerIndex}
								questionID={question.id}
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
						className="text-blue-500 font-bold text-lg hover:bg-transparent hover:text-blue-600"
						onClick={() => onAnswerAdd(question.id)}
					>
						Add answer +
					</Button>
				</div>
    </>
  )
}

export default MultipleChoiceQuestionContent