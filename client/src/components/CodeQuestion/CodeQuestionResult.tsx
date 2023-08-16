import { cn } from "../../lib/utils";
import { CodeAnswer, CodeQuestionType, QuestionType } from "../../types/models";
import { renderTextWithLineBreaks } from "../../utils/testUtils";
import CodeMirror from "@uiw/react-codemirror";
import MDEditor from "@uiw/react-md-editor";
import { checkCode } from "../../utils/dbUtils";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../ui/Spinner";

interface Props {
	question: QuestionType;
	userCode: CodeAnswer;
	questionIndex: number;
	onSetCodeCorrect: (value: boolean, questionIndex: number) => void;
	onLoaded: () => void;
}

const CodeQuestionResult = ({
	question,
	userCode,
	questionIndex,
	onSetCodeCorrect,
	onLoaded,
}: Props) => {
	const { data, isLoading } = useQuery({
		queryKey: ["code", userCode],
		queryFn: () =>
			checkCode(question.question, userCode.userCode, (question as CodeQuestionType).correctCode),
		onSuccess: (data) => {
			onSetCodeCorrect(data.isCorrect, questionIndex);
			onLoaded();
		},
		refetchOnWindowFocus: false,
	});

	return (
		<div className="flex flex-col-reverse w-full border gap-5 border-slate-200 p-5">
			<div className="flex flex-1 flex-col gap-2">
				<h3 className="text-sm font-bold text-slate-300">Question {questionIndex + 1}</h3>
				<p className="text-medium font-bold text-zinc-800">
					{renderTextWithLineBreaks(question.question)}
				</p>
				<div className="flex flex-1 items-center justify-center aspect-w-2 aspect-h-1 ">
					{question.imageUrl && (
						<img
							className="object-cover border border-slate-200"
							src={`${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${question.imageUrl}`}
							alt="img"
						/>
					)}
				</div>
				<div>
					<MDEditor.Markdown source={(question as CodeQuestionType).description} className="p-2" />
				</div>
				<div className="flex flex-col md:flex-row flex-1 p-3 gap-3 w-full">
					<div className="flex-1 overflow-auto border-blue-500 border rounded-sm">
						<p className=" bg-primary px-5 pt-2  rounded-t-sm font-bold text-xs">CORRECT CODE</p>
						<CodeMirror value={(question as CodeQuestionType).correctCode} readOnly />
					</div>
					<div
						className={cn(
							`flex-1 overflow-auto border-blue-500 border rounded-sm ${
								userCode.isCorrect ? "border-green-500" : "border-red-500"
							}`
						)}
					>
						<p className=" bg-primary px-5 pt-2  rounded-t-sm font-bold text-xs">
							YOUR CODE:{" "}
							<span className={`${userCode.isCorrect ? "text-green-500" : "text-red-500"}`}>
								{userCode.isCorrect ? "CORRECT" : "WRONG"}
							</span>
						</p>
						<CodeMirror value={userCode.userCode} readOnly />
					</div>
				</div>
				{isLoading ? (
					<Spinner />
				) : (
					<div>
						<MDEditor.Markdown source={data?.description} className="p-2" />
					</div>
				)}
			</div>
		</div>
	);
};

export default CodeQuestionResult;
