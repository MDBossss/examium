import { CodeQuestionType, TestType } from "../types/models";
import MDEditor from "@uiw/react-md-editor";
import CodeMirror from "@uiw/react-codemirror";

interface Props {
	test: TestType;
	questionNumber: number;
	handleCodeChange: (value: string) => void;
}

const CodeQuestionSolve = ({ test, questionNumber, handleCodeChange }: Props) => {
	return (
		<div className="flex flex-col gap-2 w-full">
			{(test.questions[questionNumber] as CodeQuestionType).description && (
				<MDEditor.Markdown
					source={(test.questions[questionNumber] as CodeQuestionType).description}
					className="p-2"
				/>
			)}

			<CodeMirror
				minHeight="200px"
				width="100%"
				theme="light"
				onChange={(value) => handleCodeChange(value)}
			/>
		</div>
	);
};

export default CodeQuestionSolve;
