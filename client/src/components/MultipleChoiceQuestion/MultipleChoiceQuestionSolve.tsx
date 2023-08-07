import { CodeAnswer, MultipleChoiceQuestionType, TestType } from "../../types/models";
import QuizAnswer from "../QuizAnswer";

interface Props {
	test: TestType;
	questionNumber: number;
	userAnswers: (CodeAnswer | boolean[])[];
	questionDone: boolean[];
	handleCheck: (questionIndex: number, answerIndex: number) => void;
}

const MultipleChoiceQuestionSolve = ({
	test,
	questionNumber,
	userAnswers,
	handleCheck,
	questionDone,
}: Props) => {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-3">
			{(test?.questions[questionNumber] as MultipleChoiceQuestionType).answers.map(
				(answer, answerIndex) =>
					answer.answer && (
						<QuizAnswer
							key={answer.id}
							answer={answer}
							answerIndex={answerIndex}
							isChecked={(userAnswers[questionNumber] as boolean[] )[answerIndex] as boolean}
							handleCheck={handleCheck}
							questionNumber={questionNumber}
							questionDone={questionDone}
						/>
					)
			)}
		</div>
	);
};

export default MultipleChoiceQuestionSolve;
