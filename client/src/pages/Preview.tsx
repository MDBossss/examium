import { useLocation, useNavigate, useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { TestType } from "../types/models";
import { useEffect, useState } from "react";
import QuizAnswer from "../components/QuizAnswer";
import { Button } from "../components/ui/Button";
import { fetchTestById } from "../utils/dbUtils";

const Preview = () => {
	const { id } = useParams();
	const [hasParamId, setHasParamId] = useState<boolean>(false);
	const location = useLocation();
	const navigate = useNavigate();
	const [test, setTest] = useState<TestType>(location.state?.test);
	const [questionNumber, setQuestionNumber] = useState<number>(0);
	const [questionDone, setQuestionDone] = useState<boolean[]>([]);
	const [answersChecked, setAnswersChecked] = useState<boolean[][]>([]);
	const [disableNavigation,setDisableNavigation] = useState<boolean>(false);

	const line = document.getElementById("line");

	useEffect(() => {
		const initialLoad = async () => {
			if (id) {
				setHasParamId(true);
				await fetchTestById(id)
					.then((response) => {
						console.log("has id and fetched");
						setTest(response);
						setInitialData(response);
					})
					.catch(() => {
						console.log("has id not fetched");
						navigate("/404");
					});
			} else if (test) {
				console.log("passed test thru navigate");
				setInitialData(test);
				setHasParamId(false);
			} else {
				console.log("nothing passed thru, and no id, send him back");
				setHasParamId(false);
				navigate("/", { replace: true });
			}
		};
		initialLoad();
	}, [id]);

	const setInitialData = (test: TestType) => {
		setQuestionDone(Array(test.questions.length).fill(false));
		setAnswersChecked(
			test?.questions.map(() => Array(test?.questions[0].answers.length).fill(false))
		);
	};

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
			setDisableNavigation(true);
			setQuestionDone((prevArray) => {
				const updatedArray = [...prevArray];
				updatedArray[questionNumber] = true;
				return updatedArray;
			});
			line?.classList.add("filled");
			setTimeout(() => {
				setDisableNavigation(false);
				line?.classList.remove("filled");
				setQuestionNumber((prev) => prev + 1);
			}, 3000);
		}
	};

	const handleDecrementQuestion = () => {
		setQuestionNumber((prev) => prev - 1);
	};

	const handleFinishTest = async () => {
		setDisableNavigation(true);
		setQuestionDone((prevArray) => {
			const updatedArray = [...prevArray];
			updatedArray[questionNumber] = true;
			return updatedArray;
		});
		line?.classList.add("filled");
		setTimeout(() => {
			setDisableNavigation(false)
			line?.classList.remove("filled");
			if (hasParamId) {
				navigate("/solve/results", {
					state: { test: test, answersChecked: answersChecked, hasParamId: hasParamId },
				});
			} else {
				navigate("/create/preview/results", {
					state: { test: test, answersChecked: answersChecked, hasParamId: hasParamId },
				});
			}
		}, 3000);
	};

	return (
		<div className="flex flex-col gap-10 p-4 pt-5 w-full max-w-screen sm:p-10">
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
				<div id="line" className="fill-line"></div>
				<h1 className="text-2xl font-bold text-center">
					{test?.questions[questionNumber].question}
				</h1>
				<div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-3">
					{answersChecked.length > 1 &&
						test.questions &&
						test.questions.length > 0 &&
						test?.questions[questionNumber].answers.map((answer, answerIndex) =>
							answer.answer.length ? (
								<QuizAnswer
									key={answer.id}
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
							disabled={disableNavigation}
						>
							Previous question
						</Button>
					)}

					{questionNumber !== test?.questions.length - 1 && (
						<Button
							className="flex-1 py-7 bg-blue-500 hover:bg-blue-600"
							onClick={handleIncrementQuestion}
							disabled={disableNavigation}
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
							disabled={disableNavigation}
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
