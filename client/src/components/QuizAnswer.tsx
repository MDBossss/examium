import { useEffect, useState } from "react";
import { AnswerType } from "../types/models";
import { Checkbox } from "./ui/Checkbox";
import { renderTextWithLineBreaks } from "../utils/testUtils";

interface Props {
	answer: AnswerType;
	answerIndex: number;
	isChecked: boolean;
	handleCheck: (questionIndex: number, answerIndex: number) => void;
	questionNumber: number;
	questionDone: boolean[];
}

const QuizAnswer = ({
	answer,
	answerIndex,
	isChecked,
	questionDone,
	questionNumber,
	handleCheck,
}: Props) => {
	const [selectedCorrect, setSelectedCorrect] = useState<boolean>(false);
	const [selectedWrong, setSelectedWrong] = useState<boolean>(false);

	const handleClick = () => {
		if (!questionDone[questionNumber]) {
			handleCheck(questionNumber, answerIndex);
		}
	};

	useEffect(() => {
		if (questionDone[questionNumber]) {
			if (isChecked && answer.isCorrect) {
				//correct answer - change color to green
				setSelectedCorrect(true);
			} else if (isChecked && !answer.isCorrect) {
				//wrong answer - change color to red
				setSelectedWrong(true);
			} else if (!isChecked && answer.isCorrect) {
				setSelectedCorrect(true);
			}
		}
	}, [questionDone]);

	return (
		<div
			className={`${
				selectedCorrect ? "bg-green-300" : selectedWrong ? "bg-red-500" : "bg-primary"
			} flex items-center gap-2 p-4 rounded-sm transition-all cursor-pointer`}
			onClick={() => handleClick()}
		>
			<Checkbox checked={isChecked} disabled={questionDone[questionNumber]} />
			<p className="break-anywhere">{renderTextWithLineBreaks(answer.answer)}</p>
		</div>
	);
};

export default QuizAnswer;
