import { AnswerType } from "../../types/models";
import { renderTextWithLineBreaks } from "../../utils/testUtils";

interface Props {
	answer: AnswerType;
	answerIndex: number;
	isChecked: boolean;
}

const ResultAnswer = ({ answer, answerIndex, isChecked }: Props) => {
	const conditionalColors = () => {
		if (answer.isCorrect && isChecked) {
			return "text-green-500";
		} else if (answer.isCorrect && !isChecked) {
			return "text-green-500";
		} else if (!answer.isCorrect && isChecked) {
			return "text-red-500";
		} else {
			return "text-slate-500";
		}
	};

	return (
		<div className="grid items-center grid-cols-12">
			<p
				className={`${conditionalColors()} col-span-2 sm:col-span-1 p-3 text-medium font-medium border-r border-slate-200 dark:border-slate-800`}
			>
				{String.fromCharCode(65 + answerIndex)}
			</p>
			<p className={`${conditionalColors()} col-span-10 sm:col-span-11 text-medium font-medium px-5 py-3`}>
				{renderTextWithLineBreaks(answer.answer)}
			</p>
		</div>
	);
};

export default ResultAnswer;
