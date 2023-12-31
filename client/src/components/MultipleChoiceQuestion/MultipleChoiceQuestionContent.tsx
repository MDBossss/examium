import { MultipleChoiceQuestionType, QuestionType } from "../../../../shared/models";
import Answer from "../Answer";
import { Button } from "../ui/Button";

interface Props {
	question: QuestionType;
	questionIndex: number;
	onAnswerAdd: (questionID: string) => void;
	onAnswerChange: (text: string, questionIndex: number, answerIndex: number) => void;
	onAnswerDelete: (questionID: string, answerID: string) => void;
	toggleAnswerCorrect: (questionID: string, answerID: string) => void;
}

const MultipleChoiceQuestionContent = ({
	question,
	questionIndex,
	onAnswerAdd,
	onAnswerChange,
	onAnswerDelete,
	toggleAnswerCorrect,
}: Props) => {

	return (
		<>
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
					className="text-lg font-bold text-blue-500 dark:text-blue-600 dark:hover:text-blue-700 hover:bg-transparent hover:text-blue-600"
					onClick={() => onAnswerAdd(question.id)}
				>
					Add answer +
				</Button>
			</div>
		</>
	);
};

export default MultipleChoiceQuestionContent;
