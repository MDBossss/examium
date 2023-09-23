import CodeMirror from "@uiw/react-codemirror";
import MDEditor from "@uiw/react-md-editor";
import { CodeQuestionType, QuestionType } from "../../types/models";
import { useThemeStore } from "../../store/themeStore";
import { Checkbox } from "../ui/Checkbox";

interface Props {
	question: QuestionType;
	onCorrectCodeChange: (correctCode: string, questionID: string) => void;
	onMarkdownChange: (description: string, questionID: string) => void;
	onToggleShowCorrectCodeOnResults: (questionID: string) => void;
}

const CodeQuestion = ({
	question,
	onCorrectCodeChange,
	onMarkdownChange,
	onToggleShowCorrectCodeOnResults,
}: Props) => {
	const { theme } = useThemeStore();

	//there iis no built it state to handle the dark/light mode in the actual component
	theme === "dark"
		? document.documentElement.setAttribute("data-color-mode", "dark")
		: document.documentElement.setAttribute("data-color-mode", "light");

	return (
		<div className="flex flex-col ">
			<p className="px-5 pt-2 text-xs font-bold rounded-t-sm bg-my_primary dark:bg-gray-800">
				DESCRIPTION (OPTIONAL)
			</p>
			<div className="px-5 pb-5 bg-my_primary dark:bg-gray-800">
				<MDEditor
					value={(question as CodeQuestionType).description}
					onChange={(value) => onMarkdownChange(value!, question.id)}
				/>
			</div>

			<p className="px-5 pt-2 text-xs font-bold rounded-t-sm bg-my_primary dark:bg-gray-800">
				CORRECT CODE
			</p>
			<div className="relative">
				<div
					className="absolute z-50 flex items-center gap-2 px-1 text-sm font-bold rounded-sm cursor-pointer bottom-2 right-6"
					onClick={() => onToggleShowCorrectCodeOnResults(question.id)}
				>
					<Checkbox checked={(question as CodeQuestionType).showCorrectCodeOnResults} />
					Show on results
				</div>
				<CodeMirror
					minHeight="200px"
					width="100%"
					theme={theme}
					className="px-5 border-none rounded-sm rounded-t-none outline-none bg-my_primary dark:bg-gray-800"
					onChange={(value) => onCorrectCodeChange(value, question.id)}
					value={(question as CodeQuestionType).correctCode}
				/>
			</div>
		</div>
	);
};

export default CodeQuestion;
