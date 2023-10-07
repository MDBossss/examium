import { QuestionType, QuestionVariantsType } from "../types/models";
import QuestionHeader from "./QuestionHeader";
import MultipleChoiceQuestionContent from "./MultipleChoiceQuestion/MultipleChoiceQuestionContent";
import CodeQuestion from "./CodeQuestion/CodeQuestion";

interface Props {
	question: QuestionType;
	questionIndex: number;
	onSetQuestionImage: (imageUrl: string | undefined, questionID: string) => void;
	onQuestionChange: (text: string, questionID: string) => void;
	onQuestionDelete: (questionID: string) => void;
	onQuestionTypeChange: (value: QuestionVariantsType["type"], questionIndex: number) => void;
	onAnswerAdd: (questionID: string) => void;
	onAnswerChange: (text: string, questionIndex: number, answerIndex: number) => void;
	onAnswerDelete: (questionID: string, answerID: string) => void;
	toggleAnswerCorrect: (questionID: string, answerID: string) => void;
	onCorrectCodeChange: (correctCode: string, questionID: string) => void;
	onMarkdownChange: (description: string, questionID: string) => void;
	onToggleShowCorrectCodeOnResults: (questionID: string) => void;
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
	onCorrectCodeChange,
	onMarkdownChange,
	onToggleShowCorrectCodeOnResults,
}: Props) => {
	return (
		<div className="w-full p-3 rounded-sm bg-slate-200 dark:bg-gray-900 sm:p-5">
			<div className="flex flex-col max-w-4xl gap-5 pt-10 pb-10 mx-auto">
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
						onAnswerAdd={onAnswerAdd}
						onAnswerChange={onAnswerChange}
						onAnswerDelete={onAnswerDelete}
						toggleAnswerCorrect={toggleAnswerCorrect}
					/>
				) : (
					<CodeQuestion
						question={question}
						onCorrectCodeChange={onCorrectCodeChange}
						onMarkdownChange={onMarkdownChange}
						onToggleShowCorrectCodeOnResults={onToggleShowCorrectCodeOnResults}
					/>
				)}
			</div>
		</div>
	);
};

export default Question;
