import { useLocation, useNavigate } from "react-router-dom";
import { TestType } from "../types/models";
import { useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { Button } from "../components/ui/Button";

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

	const result = (calculateScore() / calculateMaxScore()) * 100;

	return (
		<div className="flex flex-col gap-10 p-10 pt-5 w-full">
			<SearchBar />
			<div className="max-w-6xl mx-auto flex gap-5 flex-col w-full items-center bg-slate-200 p-7">
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
