import { Textarea } from "./ui/textarea";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { AnswerType } from "../types/models";

interface Props {
	label: string;
	answerIndex: number;
	questionIndex: number;
	answer: AnswerType;
	onAnswerChange: (text: string, answerIndex: number, questionIndex: number) => void;
	onAnswerDelete: (answerIndex: number, questionIndex: number) => void;
	toggleAnswerCorrect: (answerIndex: number, questionIndex: number) => void;
}

const Answer = ({
	onAnswerChange,
	onAnswerDelete,
	toggleAnswerCorrect,
	label,
	answerIndex,
	questionIndex,
	answer,
}: Props) => {
	return (
		<div className="flex items-center">
			<h2 className="text-xl text-zinc-400 p-5 max-w-[50px]">{label}</h2>
			<div className="relative flex w-full">
				<Textarea
					className="bg-primary text-lg p-5 pr-14 overflow-hidden resize-none"
					onChange={(e) => onAnswerChange(e.target.value, answerIndex, questionIndex)}
					placeholder="Answer..."
					value={answer.answer}
				/>
				<CheckIcon
					className={`${
						answer.isCorrect ? "bg-green-500 text-white" : "text-green-600 bg-green-100"
					} absolute right-2 top-2 z-10 h-8 w-8 p-2 rounded-sm  hover:bg-green-500 hover:text-white cursor-pointer`}
					onClick={() => toggleAnswerCorrect(answerIndex, questionIndex)}
				/>
				<XMarkIcon
					className="absolute right-2 top-12 z-10 h-8 w-8 p-2 rounded-sm text-zinc-400 bg-transparent hover:bg-red-500 hover:text-white cursor-pointer"
					onClick={() => onAnswerDelete(answerIndex, questionIndex)}
				/>
			</div>
		</div>
	);
};

export default Answer;
