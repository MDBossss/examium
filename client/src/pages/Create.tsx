import { useEffect, useState } from "react";
import Question from "../components/Question";
import SearchBar from "../components/SearchBar";
import { Input } from "../components/ui/Input";
import { TestType } from "../types/models";
import { useNavigate } from "react-router-dom";
import ResetDialog from "../components/ui/Dialogs/ResetDialog";
import SettingsDialog from "../components/ui/Dialogs/SettingsDialog";
import { z } from "zod";
import { useToast } from "../hooks/useToast";
import useGenerateData from "../hooks/useGenerateData";

const titleSchema = z.string().max(50, { message: "Title must be at most 50 characters" });

const Create = () => {
	const { generateAnswer, generateQuestion, generateTest } = useGenerateData();
	const [test, setTest] = useState<TestType>(generateTest());
	const [titleError, setTitleError] = useState<boolean>(false);
	const navigate = useNavigate();
	const { toast } = useToast();

	const handlePreviewTest = () => {
		sessionStorage.setItem("test", JSON.stringify(test));

		//check if title is set, at least 2 questions, and if user is logged in
		//ir user not logged in display login modal fairst
		//navigate to /preview and pass test object with react router
		navigate("/create/preview", { state: { test } });
	};

	useEffect(() => {
		const testJSON = sessionStorage.getItem("test");
		if (testJSON && setTest) {
			let test: TestType = JSON.parse(testJSON);
			setTest(test);
			sessionStorage.removeItem("test");
		}
	}, []);

	const handleDeleteTest = () => {
		setTest(generateTest());
	};

	const handleSetTestTitle = (title: string) => {
		try {
			titleSchema.parse(title);
			setTitleError(false);
			setTest((prevTest) => ({
				...prevTest,
				title: title,
			}));
		} catch (error) {
			setTitleError(true);
			console.log(error);
			toast({
				description: "Title is at most 50 characters",
				variant: "destructive",
			});
		}
	};

	const handleSetQuestionImage = (imageUrl: string | undefined, questionID: string) => {
		setTest((prevTest) => ({
			...prevTest,
			questions: prevTest.questions.map((question) =>
				question.id === questionID ? { ...question, imageUrl } : question
			),
		}));
	};

	const handleQuestionChange = (text: string, questionID: string) => {
		setTest((prevTest) => ({
			...prevTest,
			questions: prevTest.questions.map((question) =>
				question.id === questionID ? { ...question, question: text } : question
			),
		}));
	};

	const handleAddQuestion = () => {
		setTest((prevTest) => ({
			...prevTest,
			questions: [...prevTest.questions, generateQuestion()],
		}));
	};

	const handleQuestionDelete = (questionID: string) => {
		setTest((prevTest) => ({
			...prevTest,
			questions: prevTest.questions.filter((question) => question.id !== questionID),
		}));
	};

	const handleAnswerChange = (text: string, questionIndex: number, answerIndex: number) => {
		if (answerIndex === test.questions[questionIndex].answers.length - 1) {
			setTest((prevTest) => {
				let updatedTest = { ...prevTest };
				updatedTest.questions[questionIndex].answers.push(generateAnswer());
				return updatedTest;
			});
		}

		setTest((prevTest) => {
			let updatedTest = { ...prevTest };
			updatedTest.questions[questionIndex].answers[answerIndex].answer = text;
			return updatedTest;
		});
	};

	const handleAnswerDelete = (questionID: string, answerID: string) => {
		setTest((prevTest) => ({
			...prevTest,
			questions: prevTest.questions.map((question) => ({
				...question,
				answers:
					question.id === questionID
						? question.answers.filter((ans) => ans.id !== answerID)
						: question.answers,
			})),
		}));
	};

	const handleAddAnswer = (questionID: string) => {
		setTest((prevTest) => ({
			...prevTest,
			questions: prevTest.questions.map((question) =>
				question.id == questionID
					? { ...question, answers: [...question.answers, generateAnswer()] }
					: question
			),
		}));
	};

	const handleToggleCorrectAnswer = (questionID: string, answerID: string) => {
		setTest((prevTest) => ({
			...prevTest,
			questions: prevTest.questions.map((question) =>
				question.id === questionID
					? {
							...question,
							answers: question.answers.map((answer) =>
								answer.id === answerID
									? {
											...answer,
											isCorrect: !answer.isCorrect,
									  }
									: answer
							),
					  }
					: question
			),
		}));
	};


	return (
		<div className="flex flex-col gap-10 p-10 pt-5 w-full">
			<SearchBar test={test} setTest={setTest} />
			<div className="flex flex-col border-slate-200 border-b">
				<h1 className="text-2xl font-bold text-zinc-800">Create a test</h1>
				<p className="text-slate-400 text-sm pt-3 pb-3">
					Great! Now compose your test - add questions answers to each of them. Each question must
					have at least one correct answer.
				</p>
				<div className="flex gap-5 mb-2 p-2">
					<Input
						placeholder="Insert test name..."
						onChange={(e) => handleSetTestTitle(e.target.value)}
						className={`${titleError && "focus-visible:ring-red-500"} bg-slate-200`}
						value={test.title}
					/>
					<SettingsDialog test={test} setTest={setTest} />
					<ResetDialog onTrigger={handleDeleteTest} />
				</div>
			</div>
			{test.questions.map((question, questionIndex) => {
				return (
					<Question
						key={questionIndex}
						question={question}
						questionIndex={questionIndex}
						onSetQuestionImage={handleSetQuestionImage}
						onQuestionChange={handleQuestionChange}
						onQuestionDelete={handleQuestionDelete}
						onAnswerChange={handleAnswerChange}
						onAnswerDelete={handleAnswerDelete}
						toggleAnswerCorrect={handleToggleCorrectAnswer}
						onAnswerAdd={handleAddAnswer}
					/>
				);
			})}

			<div className="flex gap-3 justify-center">
				<div
					className="flex flex-1 bg-blue-200 text-blue-500 font-bold p-5 text-xl justify-center hover:bg-blue-500 hover:text-white cursor-pointer"
					onClick={handleAddQuestion}
				>
					Add question +
				</div>
				<div
					className="flex flex-1 bg-blue-200 text-blue-500 font-bold p-5 text-xl justify-center hover:bg-blue-500 hover:text-white cursor-pointer"
					onClick={handlePreviewTest}
				>
					Preview test
				</div>
			</div>
		</div>
	);
};

export default Create;
