import { useEffect, useState } from "react";
import { useSession } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";
import Question from "../components/Question";
import SearchBar from "../components/SearchBar";
import { Input } from "../components/ui/input";
import {
	CodeQuestionType,
	MultipleChoiceQuestionType,
	QuestionVariantsType,
	TestType,
} from "../types/models";
import ResetDialog from "../components/ui/Dialogs/ResetDialog";
import SettingsDialog from "../components/ui/Dialogs/SettingsDialog";
import { z } from "zod";
import { useToast } from "../hooks/useToast";
import useGenerateData from "../hooks/useGenerateData";
import { validateTest } from "../utils/testUtils";
import { createTest, deleteTest, fetchTestById, updateTest } from "../utils/dbUtils";
import CollaborationsDialog from "../components/ui/Dialogs/CollaborationsDialog";
import { useThemeStore } from "../store/themeStore";

const titleSchema = z.string().max(50, { message: "Title must be at most 50 characters" });

const Create = () => {
	const { id } = useParams();
	const [hasParamId, setHasParamId] = useState<boolean>(false);
	const { generateAnswer, generateQuestion, generateTest } = useGenerateData();
	const [test, setTest] = useState<TestType>(generateTest());
	const [titleError, setTitleError] = useState<boolean>(false);
	const navigate = useNavigate();
	const { toast } = useToast();
	const { session } = useSession();

	const { theme } = useThemeStore();

	theme === "dark"
		? document.documentElement.setAttribute("data-color-mode", "dark")
		: document.documentElement.setAttribute("data-color-mode", "light");

	useEffect(() => {
		//test generation
		const initialLoad = async () => {
			const testJSON = sessionStorage.getItem("test"); // get test from sessionStorage
			//if it exists, means we came from /preview and want to keep editing the same test, and not fetch
			if (testJSON) {
				let test: TestType = JSON.parse(testJSON);
				setTest(test);
				sessionStorage.removeItem("test");
			}
			//if theres nothing in sessionStorage, get test from the db by id if there is one passed from the params
			else if (id) {
				setHasParamId(true);
				const response = await fetchTestById(id);
				if (response) {
					setTest(response);
				} else {
					navigate("/404");
				}
				//if theres nothing in sessionStorage and no id passed in params, generate an empty test
			} else {
				setHasParamId(false);
				setTest(generateTest());
			}
		};
		initialLoad();
	}, [id]);

	useEffect(() => {
		updateTestAuthor();
	}, [session?.user]);

	const handleSaveTest = async () => {
		if (session && session?.status === "active") {
			const { testValid, messages } = validateTest(test, setTest);
			if (testValid) {
				//send data to backend and handle errors
				if (hasParamId) {
					//update test
					await updateTest(test)
						.then(() => {
							toast({
								description: "✅ Saved successfully.",
							});
						})
						.catch(() => {
							toast({
								description: "😓 Failed to save the test.",
								variant: "destructive",
							});
						});
				} else {
					//create test
					await createTest(test)
						.then(() => {
							setHasParamId(true);
							toast({
								description: "✅ Created successfully.",
							});
						})
						.catch(() => {
							toast({
								description: "😓 Failed to create the test.",
								variant: "destructive",
							});
						});
				}
			} else {
				messages.forEach((message) => {
					toast({
						description: message,
						variant: "destructive",
					});
				});
			}
		} else {
			toast({
				description: "You need to be logged in order to do that.",
				variant: "destructive",
			});
		}
	};

	const handlePreviewTest = () => {
		const { testValid, messages } = validateTest(test, setTest);
		if (!testValid) {
			messages.forEach((message) => {
				toast({
					description: message,
					variant: "destructive",
				});
			});
		} else {
			sessionStorage.setItem("test", JSON.stringify(test));
			navigate("/create/preview", { state: { test } });
		}
	};

	const handleDeleteTest = async () => {
		if (hasParamId) {
			if (session?.user.id === test.authorId) {
				await deleteTest(test)
					.then(() => {
						setTest(generateTest());
						navigate("/create");
						toast({
							description: "✅ Deleted successfully.",
						});
					})
					.catch(() => {
						toast({
							description: "😓 Failed to delete the test.",
						});
					});
			} else {
				toast({
					description: "Only test author can do that.",
					variant: "destructive",
				});
			}
		} else {
			navigate("/create");
		}
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
			toast({
				description: "Title is at most 50 characters",
				variant: "destructive",
			});
		}
	};

	const updateTestAuthor = () => {
		if (!test.authorId) {
			setTest((prevTest) => ({ ...prevTest, authorId: session?.user.id }));
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
			questions: [...prevTest.questions, generateQuestion(prevTest.defaultQuestionType)],
		}));
	};

	const handleQuestionDelete = (questionID: string) => {
		setTest((prevTest) => ({
			...prevTest,
			questions: prevTest.questions.filter((question) => question.id !== questionID),
		}));
	};

	const handleQuestionTypeChange = (value: QuestionVariantsType["type"], questionIndex: number) => {
		setTest((prevTest) => ({
			...prevTest,
			questions: prevTest.questions.map((question, index) => {
				if (index === questionIndex) {
					return generateQuestion(value);
				} else {
					return question;
				}
			}),
		}));
	};

	const handleAnswerChange = (text: string, questionIndex: number, answerIndex: number) => {
		if (test.questions[questionIndex].type === "MULTIPLE_CHOICE") {
			if (
				answerIndex ===
				(test.questions[questionIndex] as MultipleChoiceQuestionType).answers.length - 1
			) {
				setTest((prevTest) => {
					let updatedTest = { ...prevTest };
					(updatedTest.questions[questionIndex] as MultipleChoiceQuestionType).answers.push(
						generateAnswer()
					);
					return updatedTest;
				});
			}

			setTest((prevTest) => {
				let updatedTest = { ...prevTest };
				(updatedTest.questions[questionIndex] as MultipleChoiceQuestionType).answers[
					answerIndex
				].answer = text;
				return updatedTest;
			});
		}
	};

	const handleAnswerDelete = (questionID: string, answerID: string) => {
		setTest((prevTest) => ({
			...prevTest,
			questions: prevTest.questions.map((question) => ({
				...question,
				answers:
					question.id === questionID
						? (question as MultipleChoiceQuestionType).answers.filter((ans) => ans.id !== answerID)
						: (question as MultipleChoiceQuestionType).answers,
			})),
		}));
	};

	const handleAddAnswer = (questionID: string) => {
		setTest((prevTest) => ({
			...prevTest,
			questions: prevTest.questions.map((question) =>
				question.id == questionID
					? {
							...question,
							answers: [...(question as MultipleChoiceQuestionType).answers, generateAnswer()],
					  }
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
							answers: (question as MultipleChoiceQuestionType).answers.map((answer) =>
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

	const handleCorrectCodeChange = (correctCode: string, questionID: string) => {
		setTest((prevTest) => ({
			...prevTest,
			questions: prevTest.questions.map((question) =>
				question.id === questionID
					? { ...(question as CodeQuestionType), correctCode: correctCode }
					: question
			),
		}));
	};

	const handleMarkdownChange = (description: string, questionID: string) => {
		setTest((prevTest) => ({
			...prevTest,
			questions: prevTest.questions.map((question) =>
				question.id === questionID
					? { ...(question as CodeQuestionType), description: description }
					: question
			),
		}));
	};

	return (
		<div className="flex flex-col w-full gap-10 p-4 pt-5 max-w-screen sm:p-10">
			<SearchBar test={test} setTest={setTest} />
			<div className="flex flex-col text-center border-b border-slate-200 dark:border-gray-800 sm:text-left">
				<h1 className="text-2xl font-bold ">Create a test</h1>
				<p className="pt-3 pb-3 text-sm text-slate-400">
					Great! Now compose your test - add questions answers to each of them. Each question must
					have at least one correct answer.
				</p>
				<div className="flex flex-col-reverse gap-3 p-2 mb-2 md:flex-row">
					<Input
						placeholder="Insert test name..."
						onChange={(e) => handleSetTestTitle(e.target.value)}
						className={`${titleError && "focus-visible:ring-red-500"} `}
						value={test.title}
					/>
					<div className="flex gap-3">
						<SettingsDialog test={test} setTest={setTest} />
						<CollaborationsDialog test={test} setTest={setTest} session={session} />
						<ResetDialog onTrigger={handleDeleteTest} hasParamId={hasParamId} />
					</div>
				</div>
			</div>
			{test.questions.map((question, questionIndex) => {
				return (
					<Question
						key={question.id}
						question={question}
						questionIndex={questionIndex}
						onSetQuestionImage={handleSetQuestionImage}
						onQuestionChange={handleQuestionChange}
						onQuestionDelete={handleQuestionDelete}
						onQuestionTypeChange={handleQuestionTypeChange}
						onAnswerChange={handleAnswerChange}
						onAnswerDelete={handleAnswerDelete}
						toggleAnswerCorrect={handleToggleCorrectAnswer}
						onAnswerAdd={handleAddAnswer}
						onCorrectCodeChange={handleCorrectCodeChange}
						onMarkdownChange={handleMarkdownChange}
					/>
				);
			})}

			<div className="flex flex-col justify-center gap-3 text-center md:flex-row">
				<div
					className="flex justify-center flex-1 p-5 text-xl font-bold text-blue-500 bg-blue-200 cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-gray-950 hover:bg-blue-500 hover:text-white dark:hover:text-white"
					onClick={handleAddQuestion}
				>
					Add question +
				</div>
				<div
					className="flex justify-center flex-1 p-5 text-xl font-bold text-blue-500 bg-blue-200 cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-gray-950 hover:bg-blue-500 hover:text-white dark:hover:text-white"
					onClick={handlePreviewTest}
				>
					Preview test
				</div>
				<div
					className="flex justify-center flex-1 p-5 text-xl font-bold text-blue-500 bg-blue-200 cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-gray-950 hover:bg-blue-500 hover:text-white dark:hover:text-white"
					onClick={handleSaveTest}
				>
					{hasParamId ? "Save test" : "Create test"}
				</div>
			</div>
		</div>
	);
};

export default Create;
