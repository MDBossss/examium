import { QuestionType } from "../types/models";
import ResultAnswer from "./ui/ResultAnswer";

interface Props {
	question: QuestionType;
	answersChecked: boolean[];
	questionIndex: number;
}

const QuestionResult = ({ question, questionIndex, answersChecked }: Props) => {
	return (
		<div className="flex w-full border gap-5 border-slate-200 p-5">
			<div className="flex flex-1 flex-col gap-2">
				<h3 className="text-sm font-bold text-slate-300">Question {questionIndex+1}</h3>
				<p className="text-medium font-bold text-zinc-800">{question.question}</p>
				<div className="flex flex-col flex-1 p-3">
					{question.answers.map((answer, answerIndex) =>
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
			<div className="flex flex-1 items-center justify-center aspect-w-2 aspect-h-1 ">
        {question.imageUrl && <img className="object-cover border border-slate-200" src={`${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${question.imageUrl}`} alt="img" />}
			</div>
		</div>
	);
};

export default QuestionResult;
