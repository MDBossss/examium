import CodeMirror from "@uiw/react-codemirror";
import { useCallback, useState } from "react";

const CodeQuestion = () => {
	const [userCode, setUserCode] = useState<string>();
	const onChange = useCallback((value: string) => {
		setUserCode(value);
	}, []);

	return (
		<div className="flex flex-col">
      <p className=" bg-[#282c34] px-5 pt-2 font-mono rounded-t-sm text-slate-200 font-bold text-xs">INSERT CORRECT CODE</p>
			<CodeMirror
				minHeight="200px"
				width="100%"
				theme="dark"
				className="bg-[#282c34] p-5 pt-0 rounded-t-none rounded-sm outline-none border-none"
				onChange={onChange}
				value={userCode}
			/>
		</div>
	);
};

export default CodeQuestion;
