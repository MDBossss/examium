import CodeMirror from "@uiw/react-codemirror";
import MDEditor from "@uiw/react-md-editor";
import { useCallback, useState } from "react";
import { CodeQuestionType, QuestionType } from "../types/models";

interface Props {
	question: QuestionType;
	onCorrectCodeChange: (correctCode: string, questionID: string) => void;
}

const CodeQuestion = ({ question, onCorrectCodeChange }: Props) => {
	const [md, setMd] = useState<string>();
	const onChange = useCallback((value: string) => {
		onCorrectCodeChange(value, question.id);
	}, []);

	const onMdChange = useCallback((value: string) => {
		setMd(value);
	}, []);

	//there is no state to update to make it dark mode so will have to make something
	document.documentElement.setAttribute('data-color-mode', 'light')

	return (
		<div className="flex flex-col ">
			<p className=" bg-primary px-5 pt-2 rounded-t-sm font-bold text-xs">DESCRIPTION</p>
			<div className="bg-primary px-5 pb-5">
				<MDEditor value={md} onChange={setMd} />
				<MDEditor.Markdown source={md} style={{ whiteSpace: "pre-wrap" }} />
			</div>
			<p className=" bg-primary px-5 pt-2  rounded-t-sm font-bold text-xs">CORRECT CODE</p>
			<CodeMirror
				minHeight="200px"
				width="100%"
				theme="light"
				className="bg-primary p-5 pt-0 rounded-t-none rounded-sm outline-none border-none"
				onChange={onChange}
				value={(question as CodeQuestionType).correctCode}
			/>
		</div>
	);
};

export default CodeQuestion;
