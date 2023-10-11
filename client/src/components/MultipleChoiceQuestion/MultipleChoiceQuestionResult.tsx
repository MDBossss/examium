import { MultipleChoiceQuestionType, QuestionType } from "../../../../shared/models";
import { renderTextWithLineBreaks } from "../../utils/testUtils";
import ResultAnswer from "../ui/ResultAnswer";

interface Props {
	question: QuestionType;
	answersChecked: boolean[];
	questionIndex: number;
	showQuestion: boolean
}

const MultipleChoiceQuestionResult = ({ question, questionIndex, answersChecked, showQuestion }: Props) => {


	if(!showQuestion){
		return
	}

	return (
		<div className="flex flex-col w-full gap-5 p-5 border sm:flex-row border-slate-200 dark:border-slate-800">
			<div className="flex flex-col flex-1 gap-2">
				<h3 className="text-sm font-bold text-slate-300">Question {questionIndex + 1}</h3>
				<p className="font-bold text-medium ">
					{renderTextWithLineBreaks(question.question)}
				</p>
				<div className="flex flex-col flex-1 p-3">
					{(question as MultipleChoiceQuestionType).answers.map((answer, answerIndex) =>
						answer.answer.length ? (
							<ResultAnswer
								key={answer.id}
								answer={answer}
								answerIndex={answerIndex}
								isChecked={answersChecked[answerIndex]}
							/>
						) : null
					)}
				</div>
			</div>
			<div className="flex items-center justify-center flex-1 aspect-w-2 aspect-h-1 ">
				{question.imageUrl && (
					<img
						className="object-cover border border-slate-200"
						src={`${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${question.imageUrl}`}
						alt="img"
					/>
				)}
			</div>
		</div>
	);
};

export default MultipleChoiceQuestionResult;
