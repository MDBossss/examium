import { QuestionType, QuestionVariantsType } from "../types/models";
import QuestionHeader from "./QuestionHeader";
import MultipleChoiceQuestionContent from "./MultipleChoiceQuestionContent";
import CodeQuestion from "./CodeQuestion";

interface Props {
	question: QuestionType;
	questionIndex: number;
	onSetQuestionImage: (imageUrl: string | undefined, questionID: string) => void;
	onQuestionChange: (text: string, questionID: string) => void;
	onQuestionDelete: (questionID: string) => void;
	onQuestionTypeChange: (value: QuestionVariantsType["type"],questionIndex:number) => void
	onAnswerAdd: (questionID: string) => void;
	onAnswerChange: (text: string, questionIndex: number, answerIndex: number) => void;
	onAnswerDelete: (questionID: string, answerID: string) => void;
	toggleAnswerCorrect: (questionID: string, answerID: string) => void;
}

const Question = ({
	question,
	questionIndex,
	onSetQuestionImage,
	onQuestionChange,
	onQuestionDelete,
	onQuestionTypeChange,
	onAnswerChange,
	onAnswerDelete,
	onAnswerAdd,
	toggleAnswerCorrect,
}: Props) => {
	return (
		<div className=" bg-slate-200 w-full p-3 sm:p-5 rounded-sm">
			<div className="flex flex-col gap-5 max-w-4xl mx-auto pt-10 pb-10">
				<QuestionHeader
					question={question}
					questionIndex={questionIndex}
					onQuestionChange={onQuestionChange}
					onQuestionDelete={onQuestionDelete}
					onSetQuestionImage={onSetQuestionImage}
					onQuestionTypeChange={onQuestionTypeChange}
				/>
				{question.type === "MULTIPLE_CHOICE" ? (
					<MultipleChoiceQuestionContent
						question={question}
						questionIndex={questionIndex}
						onQuestionChange={onQuestionChange}
						onAnswerAdd={onAnswerAdd}
						onAnswerChange={onAnswerChange}
						onAnswerDelete={onAnswerDelete}
						toggleAnswerCorrect={toggleAnswerCorrect}
					/>
				) : (
					<CodeQuestion />
				)}
			</div>
		</div>
	);
};

export default Question;
