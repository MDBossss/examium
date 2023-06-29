import { useLocation, useNavigate } from "react-router-dom";
import { TestType } from "../types/models";
import { useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { ArrowLeft, MoreVertical, Printer, RotateCcw } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../components/ui/Dropdown";
import CircularProgress from "../components/CircularProgress";

const Results = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const test: TestType = location.state?.test;
	const answersChecked: boolean[][] = location.state?.answersChecked;

	//protection against users wandering to this route without any data
	useEffect(() => {
		if (!test || !answersChecked) {
			navigate("/", { replace: true });
		}
	}, []);

	const calculateScore = () => {
		let answeredCorrect: number = 0;
		test?.questions.map((question, questionIndex) => {
			question.answers.map((answer, answerIndex) => {
				if (answer.isCorrect && answersChecked[questionIndex][answerIndex]) {
					answeredCorrect++;
				}
			});
		});
		return answeredCorrect;
	};

	const calculateMaxScore = () => {
		let maxScore: number = 0;
		test?.questions.map((question) => {
			question.answers.map((answer) => {
				if (answer.isCorrect) {
					maxScore++;
				}
			});
		});
		return maxScore;
	};

	const result = Math.floor((calculateScore() / calculateMaxScore()) * 100);

	const handleRestart = () => {};

	const handlePrint = () => {};

	return (
		<div className="flex flex-col gap-10 p-10 pt-5 w-full">
			<SearchBar />
			<div className="flex w-full max-w-7xl justify-between items-center border-b border-slate-200 py-5">
				<div className="flex gap-5 items-center">
					<ArrowLeft className="w-7 h-7 text-blue-500 cursor-pointer" />
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
			<div className="border-r border-slate-200">
				<div className="flex flex-col gap-5">
					<p>You scored:</p>
					<div><CircularProgress percentage={75} primaryColor={["#22C55E", "#22C55E"]} strokeWidth={7} secondaryColor="#E2E8F0" fontSize="30px"/></div>
				</div>
			</div>
			<div className="max-w-7xl mx-auto flex gap-5 flex-col w-full items-center bg-slate-200 p-7">
				<h2 className="text-md font-medium text-blue-500">{test?.title}</h2>

				{result >= 50 ? (
					<div className="flex flex-col gap-5 p-5">
						<h1 className="text-2xl font-bold text-center text-green-500">{`Congratulations! You passed the test with ${result}%`}</h1>
						<h1 className="text-3xl font-medium text-center">
							{`${calculateScore()} / ${calculateMaxScore()}`}
						</h1>
					</div>
				) : (
					<div className="flex flex-col gap-5 p-5">
						<h1 className="text-2xl font-bold text-center text-red-500">{`Study more! Your scored ${result}%`}</h1>
						<h1 className="text-3xl font-medium text-center">
							{`${calculateScore()} / ${calculateMaxScore()}`}
						</h1>
					</div>
				)}
			</div>
			<div className="flex bg-blue-200 h-min text-blue-500 font-bold p-5 text-xl justify-center hover:bg-blue-500 hover:text-white cursor-pointer">
				Return
			</div>
		</div>
	);
};

export default Results;
