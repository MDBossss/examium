import { useLocation, useNavigate } from "react-router-dom";
import { CodeAnswer, TestType } from "../../../shared/models";
import { useEffect, useState } from "react";
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
import { useSession } from "@clerk/clerk-react";
import { useTheme } from "../components/ThemeProvider";

const Results = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const {session} = useSession();
	const test: TestType = location.state?.test;
	const hasParamId: boolean = location.state?.hasParamId;

	const { theme } = useTheme();
	theme === "dark"
		? document.documentElement.setAttribute("data-color-mode", "dark")
		: document.documentElement.setAttribute("data-color-mode", "light");

	const [userAnswers, setUserAnswers] = useState<(boolean[] | CodeAnswer)[]>(
		location.state?.userAnswers
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
			navigate(`/overview/${session?.user.id}`);
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

	const handleSetIsCodeCorrect = (value: boolean, questionIndex: number) => {
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
				<div className="fixed top-0 left-0 flex flex-col items-center justify-center gap-4  bg-white bg-opacity-50 backdrop-blur-sm  transition-all w-full h-screen z-[100]">
					<span className="text-lg font-bold">Calculating results...</span> <Spinner />
				</div>
			)} 
			<>
				<div className="flex flex-col items-center w-full mx-auto max-w-7xl">
					<div className="flex items-center justify-between w-full py-5">
						<div className="flex items-center gap-5">
							<ArrowLeft className="text-blue-500 cursor-pointer w-7 h-7" onClick={handleReturn} />
							<h1 className="text-2xl font-">{test?.title}</h1>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger className="p-2 transition-all border rounded-sm outline-none ">
								<MoreVertical />
							</DropdownMenuTrigger>
							<DropdownMenuContent className="bg-my_primary dark:bg-gray-950">
								<DropdownMenuItem className="flex gap-1" onClick={handleRestart}>
									<RotateCcw className="w-4 h-4" /> Restart
								</DropdownMenuItem>
								<DropdownMenuItem className="flex gap-1" onClick={handlePrint}>
									<Printer className="w-4 h-4" /> Print
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="w-full h-[100px] bg-slate-200 dark:bg-gray-800"></div>
					<div className="flex flex-col w-full border-b md:flex-row border-slate-200 dark:border-slate-800">
						<ScoreDisplay
							userScore={userScore}
							passCriteria={test.passCriteria}
							className="border-b md:border-r border-slate-200 dark:border-slate-800"
						/>
						<SettingsDisplay test={test} />
					</div>
					<div className="flex flex-col w-full gap-3 mt-10 ">
						<p className="self-start font-medium printable">
							Your answers: ({userScore.value}/{maxScore} correct)
						</p>

						{test.questions.map((question, questionIndex) =>
							question.type === "MULTIPLE_CHOICE" ? (
								<MultipleChoiceQuestionResult
									key={question.id}
									question={question}
									answersChecked={userAnswers[questionIndex] as boolean[]}
									questionIndex={questionIndex}
									showQuestion={test.showQuestionsOnResults}
								/>
							) : (
								<CodeQuestionResult
									key={question.id}
									question={question}
									userCode={userAnswers[questionIndex] as CodeAnswer}
									questionIndex={questionIndex}
									onSetIsCodeCorrect={handleSetIsCodeCorrect}
									onLoaded={handleFetchedCodeQuestion}
									showQuestion={test.showQuestionsOnResults}
								/>
							)
						)}
					</div>
				</div>
				<div
					className="flex justify-center flex-1 p-5 text-xl font-bold text-blue-500 bg-blue-200 cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-gray-950 hover:bg-blue-500 hover:text-white dark:hover:text-white"
					onClick={handleReturn}
				>
					Return
				</div>
			</>
		</>
	);
};

export default Results;
