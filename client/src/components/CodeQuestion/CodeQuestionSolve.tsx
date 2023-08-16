import { CodeAnswer, CodeQuestionType, TestType } from "../../types/models";
import MDEditor from "@uiw/react-md-editor";
import CodeMirror from "@uiw/react-codemirror";
import { useThemeStore } from "../../store/themeStore";

interface Props {
	test: TestType;
	questionNumber: number;
	userCode: CodeAnswer;
	handleCodeChange: (value: string) => void;
}

const CodeQuestionSolve = ({ test, questionNumber, userCode, handleCodeChange }: Props) => {
	const { theme } = useThemeStore();
	
	return (
		<div className="flex flex-col w-full gap-2">
			{(test?.questions[questionNumber] as CodeQuestionType)?.description && (
				<MDEditor.Markdown
					source={(test?.questions[questionNumber] as CodeQuestionType).description}
					className="p-2"
				/>
			)}

			<CodeMirror
				minHeight="200px"
				width="100%"
				theme={theme}
				onChange={(value) => handleCodeChange(value)}
				value={userCode?.userCode}
			/>
		</div>
	);
};

export default CodeQuestionSolve;
