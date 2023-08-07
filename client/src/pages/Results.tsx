import { useLocation, useNavigate } from "react-router-dom";
import { CodeAnswer, TestType } from "../types/models";
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { ArrowLeft, MoreVertical, Printer, RotateCcw } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../components/ui/Dropdown";
import { useScore } from "../hooks/useScore";
import SettingsDisplay from "../components/ui/SettingsDisplay";
import ScoreDisplay from "../components/ui/ScoreDisplay";
import MultipleChoiceQuestionResult from "../components/MultipleChoiceQuestion/MultipleChoiceQuestionResult";
import { useToast } from "../hooks/useToast";
import CodeQuestionResult from "../components/CodeQuestion/CodeQuestionResult";
import { useQuestionCount } from "../hooks/useQuestionCount";
import Spinner from "../components/ui/Spinner";
import { useDarkmodeStore } from "../store/darkmodeStore";

const Results = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const test: TestType = location.state?.test;
	const hasParamId: boolean = location.state?.hasParamId;

	const { isDarkmode } = useDarkmodeStore();
	isDarkmode
		? document.documentElement.setAttribute("data-color-mode", "dark")
		: document.documentElement.setAttribute("data-color-mode", "light");

	const [userAnswers, setUserAnswers] = useState<(boolean[] | CodeAnswer)[]>(
		location.state.userAnswers
	);
	const [fetchedCodeQuestionsCount, setFetchedCodeQuestionsCount] = useState<number>(0);

	const { toast } = useToast();
	const { userScore, maxScore } = useScore(test?.questions, userAnswers);
	const { codeQuestionCount } = useQuestionCount(test?.questions);

	//protection against users wandering to this route without any data
	useEffect(() => {
		if (!test || !userAnswers) {
			navigate("/", { replace: true });
		}
	}, []);

	const handleReturn = () => {
		if (hasParamId) {
			navigate("/");
		} else {
			navigate(-2);
		}
	};

	const handleRestart = () => {
		if (hasParamId) {
			navigate(`/solve/${test.id}`);
		} else {
			navigate("/create/preview", { state: { test } });
		}
	};

	const handlePrint = () => {
		try {
			window.print();
		} catch (error) {
			toast({
				description: "Couldn't connect to printer.",
				variant: "destructive",
			});
		}
	};

	const handleSetCodeCorrect = (value: boolean, questionIndex: number) => {
		setUserAnswers((prev) => {
			const updatedUserAnswers = [...prev];
			(updatedUserAnswers[questionIndex] as CodeAnswer).isCorrect = value;
			return updatedUserAnswers;
		});
	};

	const handleFetchedCodeQuestion = () => {
		setFetchedCodeQuestionsCount((prev) => prev + 1);
	};

	return (
		<>
			{fetchedCodeQuestionsCount < codeQuestionCount && (
				<div className=" fixed flex flex-col items-center justify-center gap-4  bg-white bg-opacity-50 backdrop-blur-sm  transition-all w-full h-screen z-[100]">
					<span className="text-lg font-bold">Calculating results...</span> <Spinner />
				</div>
			)}
			<div className="flex flex-col gap-10 p-4 pt-5 w-full max-w-screen sm:p-10">
				<SearchBar />
				<div className="max-w-7xl mx-auto flex flex-col w-full items-center">
					<div className="flex w-full justify-between items-center py-5">
						<div className="flex gap-5 items-center">
							<ArrowLeft className="w-7 h-7 text-blue-500 cursor-pointer" onClick={handleReturn} />
							<h1 className="text-2xl font-">{test?.title}</h1>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger className="outline-none border text-slate-400 border-slate-200 p-2 rounded-sm hover:bg-slate-200 transition-all">
								<MoreVertical />
							</DropdownMenuTrigger>
							<DropdownMenuContent className="bg-primary">
								<DropdownMenuItem className="flex gap-1" onClick={handleRestart}>
									<RotateCcw className="h-4 w-4" /> Restart
								</DropdownMenuItem>
								<DropdownMenuItem className="flex gap-1" onClick={handlePrint}>
									<Printer className="h-4 w-4" /> Print
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="w-full h-[100px] bg-slate-200"></div>
					<div className="flex flex-col md:flex-row w-full border-b border-slate-200">
						<ScoreDisplay
							userScore={userScore}
							passCriteria={test.passCriteria}
							className=" border-b md:border-r border-slate-200"
						/>
						<SettingsDisplay test={test} />
					</div>
					<div className="flex flex-col w-full gap-3 mt-10 ">
						<p className="self-start font-medium printable">
							Your answers: ({userScore.value}/{maxScore} correct)
						</p>

						{test.showQuestionsOnResults &&
							test.questions.map((question, questionIndex) =>
								question.type === "MULTIPLE_CHOICE" ? (
									<MultipleChoiceQuestionResult
										key={question.id}
										question={question}
										answersChecked={userAnswers[questionIndex] as boolean[]}
										questionIndex={questionIndex}
									/>
								) : (
									<CodeQuestionResult
										key={question.id}
										question={question}
										userCode={userAnswers[questionIndex] as CodeAnswer}
										questionIndex={questionIndex}
										onSetCodeCorrect={handleSetCodeCorrect}
										onLoaded={handleFetchedCodeQuestion}
									/>
								)
							)}
					</div>
				</div>
				<div
					className="flex bg-blue-200 h-min text-blue-500 font-bold p-5 text-xl justify-center hover:bg-blue-500 hover:text-white cursor-pointer"
					onClick={handleReturn}
				>
					Return
				</div>
			</div>
		</>
	);
};

export default Results;
