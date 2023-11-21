import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CodeAnswer, MultipleChoiceQuestionType, TestType } from "../../../shared/models";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { fetchTestById } from "../api/tests";
import { randomizeTest, renderTextWithLineBreaks } from "../utils/testUtils";
import { notEmpty } from "../utils/genericUtils";
import MultipleChoiceQuestionSolve from "../components/MultipleChoiceQuestion/MultipleChoiceQuestionSolve";
import CodeQuestionSolve from "../components/CodeQuestion/CodeQuestionSolve";
import { Skeleton } from "../components/ui/Skeleton";

const Preview = () => {
	const { id } = useParams();
	const [hasParamId, setHasParamId] = useState<boolean>(false);
	const location = useLocation();
	const navigate = useNavigate();
	const [test, setTest] = useState<TestType>(location.state?.test);
	const [questionNumber, setQuestionNumber] = useState<number>(0);
	const [questionDone, setQuestionDone] = useState<boolean[]>([]);
	const [disableNavigation, setDisableNavigation] = useState<boolean>(false);
	const [isImageLoaded,setIsImageLoaded] = useState<boolean>(false);

	const [userAnswers, setUserAnswers] = useState<(boolean[] | CodeAnswer)[]>([]);

	const line = document.getElementById("line");

	useEffect(() => {
		const initialLoad = async () => {
			if (id) {
				setHasParamId(true);
				await fetchTestById(id)
					.then((response) => {
						const randomizedTest = randomizeTest(response);
						setTest(randomizedTest);
						setInitialData(randomizedTest);
					})
					.catch(() => {
						navigate("/404");
					});
			} else if (test) {
				const randomizedTest = randomizeTest(test);
				setTest(randomizedTest);
				setInitialData(randomizedTest);
				setHasParamId(false);
			} else {
				setHasParamId(false);
				navigate("/404", { replace: true });
			}
		};
		initialLoad();
	}, [id]);

	const setInitialData = (test: TestType) => {
		setQuestionDone(Array(test.questions.length).fill(false));
		setUserAnswers(
			test?.questions.map((question) =>
				question.type === "MULTIPLE_CHOICE"
					? Array<boolean>((question as MultipleChoiceQuestionType).answers.length).fill(false)
					: { isCorrect: false, userCode: "" }
			)
		);
	};

	const handleCheck = (questionIndex: number, answerIndex: number) => {
		setUserAnswers((prev) => {
			const updatedAnswers = [...prev];
			const answer = updatedAnswers[questionIndex] as boolean[];
			answer[answerIndex] = !answer[answerIndex];
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
			setDisableNavigation(false);
			line?.classList.remove("filled");
			if (hasParamId) {
				navigate("/solve/results", {
					state: { test: test, userAnswers: userAnswers, hasParamId: hasParamId },
				});
			} else {
				navigate("/create/preview/results", {
					state: { test: test, userAnswers: userAnswers, hasParamId: hasParamId },
				});
			}
		}, 3000);
	};

	const handleCodeChange = (value: string) => {
		setUserAnswers((prev) => {
			const updatedUserAnswers = [...prev];
			(updatedUserAnswers[questionNumber] as CodeAnswer).userCode = value;
			return updatedUserAnswers;
		});
	};

	return (
		<>
			<div className="flex flex-col items-center w-full max-w-5xl gap-5 mx-auto bg-slate-200 dark:bg-gray-800 p-7">
				<h2 className="font-medium text-blue-500 dark:text-blue-600 text-md">{test?.title}</h2>
				{test?.questions[questionNumber].imageUrl && (
					<div className="relative w-full">
						{!isImageLoaded && <Skeleton className="w-full aspect-video"/>}
						<img
							src={`${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${
								test?.questions[questionNumber].imageUrl
							}`}
							alt="question"
							onLoad={() => setIsImageLoaded(true)}
							className="w-full"
						/>
					</div>
				)}
				<div id="line" className="fill-line"></div>
				<h1 className="text-2xl font-bold text-left">
					{renderTextWithLineBreaks(test?.questions[questionNumber].question)}
				</h1>
				{notEmpty(userAnswers) &&
				notEmpty(test.questions) &&
				test.questions[questionNumber].type === "MULTIPLE_CHOICE" ? (
					<MultipleChoiceQuestionSolve
						test={test}
						userAnswers={userAnswers}
						questionNumber={questionNumber}
						questionDone={questionDone}
						handleCheck={handleCheck}
					/>
				) : (
					<CodeQuestionSolve
						test={test}
						questionNumber={questionNumber}
						userCode={userAnswers[questionNumber] as CodeAnswer}
						handleCodeChange={handleCodeChange}
					/>
				)}
				<div className="flex w-full gap-3 mt-12">
					{questionNumber !== 0 && (
						<Button
							className="flex-1 bg-blue-500 py-7 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
							onClick={handleDecrementQuestion}
							disabled={disableNavigation}
						>
							Previous question
						</Button>
					)}

					{questionNumber !== test?.questions.length - 1 && (
						<Button
							className="flex-1 bg-blue-500 py-7 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
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
							className="flex-1 text-lg bg-green-500 py-7 hover:bg-green-600 dark:hover:bg-green-600"
							onClick={handleFinishTest}
							disabled={disableNavigation}
						>
							Finish test
						</Button>
					)}
				</div>
			</div>
		</>
	);
};

export default Preview;
