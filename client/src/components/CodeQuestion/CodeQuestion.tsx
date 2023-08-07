import CodeMirror from "@uiw/react-codemirror";
import MDEditor from "@uiw/react-md-editor";
import { CodeQuestionType, QuestionType } from "../../types/models";
import { useDarkmodeStore } from "../../store/darkmodeStore";

interface Props {
	question: QuestionType;
	onCorrectCodeChange: (correctCode: string, questionID: string) => void;
	onMarkdownChange: (description:string,questionID: string) => void;
}

const CodeQuestion = ({ question, onCorrectCodeChange, onMarkdownChange }: Props) => {
	const {isDarkmode} = useDarkmodeStore();


	//there iis no built it state to handle the dark/light mode in the actual component
	isDarkmode ? document.documentElement.setAttribute('data-color-mode', 'dark') : document.documentElement.setAttribute('data-color-mode', 'light')

	return (
		<div className="flex flex-col ">
			<p className=" bg-primary px-5 pt-2 rounded-t-sm font-bold text-xs">DESCRIPTION</p>
			<div className="bg-primary px-5 pb-5">
				<MDEditor value={(question as CodeQuestionType).description} onChange={(value) => onMarkdownChange(value!,question.id)} />
			</div>
			<p className=" bg-primary px-5 pt-2  rounded-t-sm font-bold text-xs">CORRECT CODE</p>
			<CodeMirror
				minHeight="200px"
				width="100%"
				theme="light"
				className="bg-primary p-5 pt-0 rounded-t-none rounded-sm outline-none border-none"
				onChange={(value) => onCorrectCodeChange(value,question.id)}
				value={(question as CodeQuestionType).correctCode}
			/>
		</div>
	);
};

export default CodeQuestion;
