import { cn } from "../../lib/utils";
import { CodeAnswer, CodeQuestionType, QuestionType } from "../../../../shared/models";
import { renderTextWithLineBreaks } from "../../utils/testUtils";
import CodeMirror from "@uiw/react-codemirror";
import MDEditor from "@uiw/react-md-editor";
import { evaluateCode } from "../../api/tests";
import Spinner from "../ui/Spinner";
import { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useTheme } from "../ThemeProvider";

interface Props {
	question: QuestionType;
	userCode: CodeAnswer;
	questionIndex: number;
	onSetIsCodeCorrect: (value: boolean, questionIndex: number) => void;
	onLoaded: () => void;
	showQuestion: boolean;
}

const CodeQuestionResult = ({
	question,
	userCode,
	questionIndex,
	onSetIsCodeCorrect,
	onLoaded,
	showQuestion,
}: Props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [data, setData] = useState<{ isCorrect: boolean; description: string | undefined }>();
	const { toast } = useToast();

	useEffect(() => {
		setIsLoading(true);
		evaluateCode(question.question, (question as CodeQuestionType).correctCode, userCode.userCode)
			.then((data) => {
				setData(data);
				onSetIsCodeCorrect(data.isCorrect, questionIndex);
				onLoaded();
			})
			.catch(() => {
				setIsError(true);
				onSetIsCodeCorrect(true, questionIndex);
				onLoaded();
				toast({
					title: "Something went wrong...",
					variant: "destructive",
				});
			})
			.finally(() => setIsLoading(false));
	}, []);

	const { theme } = useTheme();
	theme === "dark"
		? document.documentElement.setAttribute("data-color-mode", "dark")
		: document.documentElement.setAttribute("data-color-mode", "light");

	if (!showQuestion) {
		return;
	}

	return (
		<div className="flex flex-col-reverse w-full gap-5 p-5 border border-slate-200">
			<div className="flex flex-col flex-1 gap-2">
				<h3 className="text-sm font-bold text-slate-300">Question {questionIndex + 1}</h3>
				<p className="font-bold text-medium">{renderTextWithLineBreaks(question.question)}</p>
				<div className="flex items-center justify-center flex-1 aspect-w-2 aspect-h-1 ">
					{question.imageUrl && (
						<img
							className="object-cover border border-slate-200"
							src={`${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${question.imageUrl}`}
							alt="img"
						/>
					)}
				</div>
				{(question as CodeQuestionType).description && (
					<div>
						<MDEditor.Markdown
							source={(question as CodeQuestionType).description}
							className="p-2"
						/>
					</div>
				)}

				<div className="flex flex-col flex-1 w-full gap-3 p-3 md:flex-row">
					{(question as CodeQuestionType).showCorrectCodeOnResults && (
						<div className="flex-1 overflow-auto border border-blue-500 rounded-sm">
							<p className="px-5 pt-2 text-xs font-bold rounded-t-sm">CORRECT CODE</p>
							<CodeMirror
								value={(question as CodeQuestionType).correctCode}
								readOnly
								theme={theme}
							/>
						</div>
					)}

					<div
						className={cn(
							`flex-1 overflow-auto border-blue-500 border rounded-sm ${
								userCode.isCorrect ? "border-green-500" : "border-red-500"
							}`
						)}
					>
						<p className="px-5 pt-2 text-xs font-bold rounded-t-sm">
							YOUR CODE:{" "}
							<span className={`${userCode.isCorrect ? "text-green-500" : "text-red-500"}`}>
								{userCode.isCorrect ? "CORRECT" : "INCORRECT"}
							</span>
						</p>
						<CodeMirror value={userCode.userCode} readOnly theme={theme} />
					</div>
				</div>
				{isLoading ? (
					<div className="flex flex-col items-center justify-center gap-1">
						<Spinner />
						<span>Loading results</span>
					</div>
				) : isError ? (
					<div className="flex justify-center">
						😓 Something happened, couldn't get question results.
					</div>
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
