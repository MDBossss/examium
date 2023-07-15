import { useEffect, useState } from "react";
import Question from "../components/Question";
import SearchBar from "../components/SearchBar";
import { Input } from "../components/ui/Input";
import { TestType } from "../types/models";
import { useNavigate, useParams } from "react-router-dom";
import ResetDialog from "../components/ui/Dialogs/ResetDialog";
import SettingsDialog from "../components/ui/Dialogs/SettingsDialog";
import { z } from "zod";
import { useToast } from "../hooks/useToast";
import useGenerateData from "../hooks/useGenerateData";
import { validateTest } from "../utils/testUtils";
import { useSession } from "@clerk/clerk-react";
import { createTest, deleteTest, fetchTestById, updateTest } from "../utils/dbUtils";
import CollaborationsDialog from "../components/ui/Dialogs/CollaborationsDialog";

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

	useEffect(() => {
		const initialLoad = async () => {
			//test generation
			if (id) {
				setHasParamId(true);
				const response = await fetchTestById(id);
				if (response) {
					setTest(response);
				} else {
					navigate("/404");
				}
			} else {
				setHasParamId(false);
				setTest(generateTest());
			}
		};
		initialLoad();
	}, [id]);

	useEffect(() => {
		const testJSON = sessionStorage.getItem("test");
		if (testJSON) {
			let test: TestType = JSON.parse(testJSON);
			setTest(test);
			sessionStorage.removeItem("test");
		}
	}, []);

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
			console.log(error);
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
		<div className="flex flex-col gap-10 p-4 pt-5 w-full max-w-screen sm:p-10">
			<SearchBar test={test} setTest={setTest} />
			<div className="flex flex-col border-slate-200 border-b text-center sm:text-left">
				<h1 className="text-2xl font-bold text-zinc-800">Create a test</h1>
				<p className="text-slate-400 text-sm pt-3 pb-3">
					Great! Now compose your test - add questions answers to each of them. Each question must
					have at least one correct answer.
				</p>
				<div className="flex flex-col-reverse md:flex-row gap-3 mb-2 p-2">
					<Input
						placeholder="Insert test name..."
						onChange={(e) => handleSetTestTitle(e.target.value)}
						className={`${titleError && "focus-visible:ring-red-500"} bg-slate-200`}
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
						onAnswerChange={handleAnswerChange}
						onAnswerDelete={handleAnswerDelete}
						toggleAnswerCorrect={handleToggleCorrectAnswer}
						onAnswerAdd={handleAddAnswer}
					/>
				);
			})}

			<div className="flex flex-col md:flex-row gap-3 justify-center text-center">
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
				<div
					className="flex flex-1 bg-blue-200 text-blue-500 font-bold p-5 text-xl justify-center hover:bg-blue-500 hover:text-white cursor-pointer"
					onClick={handleSaveTest}
				>
					{hasParamId ? "Save test" : "Create test"}
				</div>
			</div>
		</div>
	);
};

export default Create;
