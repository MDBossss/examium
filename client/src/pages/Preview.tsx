import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { TestType } from "../types/models";
import { useEffect, useState } from "react";
import QuizAnswer from "../components/QuizAnswer";
import { Button } from "../components/ui/Button";

const Preview = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const test: TestType = location.state?.test;
	const [questionNumber, setQuestionNumber] = useState<number>(0);
	const [questionDone, setQuestionDone] = useState<boolean[]>(
		Array(test?.questions.length).fill(false)
	);
	const [answersChecked, setAnswersChecked] = useState<boolean[][]>(
		test?.questions.map(() => Array(test?.questions[0].answers.length).fill(false))
	);

	//protection against users wandering to this route without any data 
	useEffect(() => {
		if (!test) { // or || if theres no id from the link of exisiting test
			navigate("/", { replace: true });
		}
	}, []);

	useEffect(() => {
		setAnswersChecked(
			test?.questions.map(() => Array(test?.questions[0].answers.length).fill(false))
		);
		setQuestionDone(Array(test?.questions.length).fill(false));
	}, []);

	const handleCheck = (questionIndex: number, answerIndex: number) => {
		setAnswersChecked((prev) => {
			const updatedAnswers = [...prev];
			updatedAnswers[questionIndex][answerIndex] = !updatedAnswers[questionIndex][answerIndex];
			return updatedAnswers;
		});
	};

	const handleIncrementQuestion = async () => {
		if (questionDone[questionNumber]) {
			setQuestionNumber((prev) => prev + 1);
		} else {
			setQuestionDone((prevArray) => {
				const updatedArray = [...prevArray];
				updatedArray[questionNumber] = true;
				return updatedArray;
			});
			setTimeout(() => {
				setQuestionNumber((prev) => prev + 1);
			}, 3000);
		}
	};


	const handleDecrementQuestion = () => {
		setQuestionNumber((prev) => prev - 1);
	};

	const handleFinishTest = async () => {
		setQuestionDone((prevArray) => {
			const updatedArray = [...prevArray];
			updatedArray[questionNumber] = true;
			return updatedArray;
		});
		setTimeout(() => {
			navigate("/create/preview/results", {state: {test: test, answersChecked:answersChecked}});
		}, 3000);
	};

	return (
		<div className="flex flex-col gap-10 p-10 pt-5 w-full ">
			<SearchBar />
			<div className=" max-w-5xl mx-auto flex gap-5 flex-col w-full items-center bg-slate-200 p-7">
				<h2 className="text-md font-medium text-blue-500">{test?.title}</h2>
				{test?.questions[questionNumber].imageUrl && (
					<div className="w-full">
						<img
							src={`${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${
								test?.questions[questionNumber].imageUrl
							}`}
							className="w-full"
						/>
					</div>
				)}
				<h1 className="text-2xl font-bold text-center">
					{test?.questions[questionNumber].question}
				</h1>
				<div className="grid grid-cols-2 w-full gap-3">
					{test?.questions[questionNumber].answers.map((answer, answerIndex) =>
						answer.answer.length ? (
							<QuizAnswer
								key={answer.answer + questionNumber}
								answer={answer}
								answerIndex={answerIndex}
								isChecked={answersChecked[questionNumber][answerIndex]}
								handleCheck={handleCheck}
								questionNumber={questionNumber}
								questionDone={questionDone}
							/>
						) : null
					)}
				</div>
				<div className="flex w-full gap-3 mt-12">
					{questionNumber !== 0 && (
						<Button
							className="flex-1 py-7 bg-blue-500 hover:bg-blue-600"
							onClick={handleDecrementQuestion}
						>
							Previous question
						</Button>
					)}

					{questionNumber !== test?.questions.length - 1 && (
						<Button
							className="flex-1 py-7 bg-blue-500 hover:bg-blue-600"
							onClick={handleIncrementQuestion}
						>
							Next question
						</Button>
					)}
				</div>
				<div className="flex w-full gap-3">
					{questionNumber == test?.questions.length - 1 && (
						<Button
							className="flex-1 py-7 text-lg bg-green-500 hover:bg-green-600"
							onClick={handleFinishTest}
						>
							Finish test
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Preview;
