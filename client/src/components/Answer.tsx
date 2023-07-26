import { Textarea } from "./ui/Textarea";
import { CheckIcon, XIcon } from "lucide-react";
import { AnswerType } from "../types/models";

interface Props {
	label: string;
	answerIndex: number;
	questionID: string;
	questionIndex: number;
	answer: AnswerType;
	onAnswerChange: (text: string, questionIndex: number, answerIndex: number) => void;
	onAnswerDelete: (questionID: string, answerID: string) => void;
	toggleAnswerCorrect: (questionID: string, answerID: string) => void;
}

const Answer = ({
	onAnswerChange,
	onAnswerDelete,
	toggleAnswerCorrect,
	label,
	answerIndex,
	questionID,
	questionIndex,
	answer,
}: Props) => {

	return (
		<div className="flex items-center">
			<h2 className="text-xl text-zinc-400 pr-2 sm:p-5 max-w-[21px] sm:max-w-[50px]">{label}</h2>
			<div className="relative flex w-full">
				<Textarea
					className="bg-primary text-lg p-5 pr-14 overflow-hidden resize-none"
					onChange={(e) => onAnswerChange(e.target.value, questionIndex, answerIndex)}
					placeholder="Answer..."
					value={answer.answer}
				/>
				<CheckIcon
					className={`${
						answer.isCorrect ? "bg-green-500 text-white" : "text-green-600 bg-green-100"
					} absolute right-2 top-2 z-10 h-8 w-8 p-2 rounded-sm  hover:bg-green-500 hover:text-white cursor-pointer transition-all`}
					onClick={() => toggleAnswerCorrect(questionID, answer.id)}
				/>
				<XIcon
					className="absolute right-2 top-12 z-10 h-8 w-8 p-2 rounded-sm text-zinc-400 bg-transparent hover:bg-red-500 hover:text-white cursor-pointer transition-all"
					onClick={() => onAnswerDelete(questionID, answer.id)}
				/>
			</div>
		</div>
	);
};

export default Answer;
