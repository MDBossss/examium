import { useState } from "react";
import Question from "../components/Question";
import SearchBar from "../components/SearchBar";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { QuestionType } from "../types/models";

const Create = () => {
	const [testTitle, setTestTitle] = useState<string>("");
	const [questions, setQuestions] = useState<QuestionType[]>([
		{ question: "", answers: [{ answer: "", isCorrect: false }] },
	]);

	const handleDeleteTest = () => {
		//trigger a modal for confirmation
		setTestTitle("");
		setQuestions([{ question: "", answers: [{ answer: "", isCorrect: false }] }]);
	};

	const handleQuestionChange = (text:string,questionIndex:number) => {
		setQuestions((prevQuestions) => {
			const updatedQuestions = [...prevQuestions];
			updatedQuestions[questionIndex].question = text;
			return updatedQuestions;
		})
	}

	const handleAddQuestion = () => {
		setQuestions((prevQuestions) => {
			return [...prevQuestions, { question: "", answers: [{ answer: "", isCorrect: false }] }];
		});
	};

	const handleQuestionDelete = (questionIndex:number) => {
		console.log("deleting q")
		setQuestions((prevQuestions) => {
			const updatedQuestions = [...prevQuestions];
			updatedQuestions.splice(questionIndex,1)
			return updatedQuestions;
		})
	}

	console.log(questions)

	const handleAnswerChange = (text: string, answerIndex: number, questionIndex: number) => {
		if (answerIndex === questions[questionIndex].answers.length - 1) {
			setQuestions((prevQuestions) => {
				const updatedQuestions = [...prevQuestions];
				updatedQuestions[questionIndex].answers.push({ answer: "", isCorrect: false });
				return updatedQuestions;
			});
		}

		setQuestions((prevQuestions) => {
			const updatedQuestions = [...prevQuestions];
			updatedQuestions[questionIndex].answers[answerIndex].answer = text;
			return updatedQuestions;
		});
	};

	const handleAnswerDelete = (answerIndex: number, questionIndex: number) => {
		setQuestions((prevQuestions) => {
			const updatedQuestions = [...prevQuestions];
			updatedQuestions[questionIndex].answers.splice(answerIndex, 1);
			return updatedQuestions;
		});
	};

	const handleAddAnswer = (questionIndex: number) => {
		console.log("adding");
		setQuestions((prevQuestions) => {
			const updatedQuestions = [...prevQuestions];
			updatedQuestions[questionIndex].answers.push({ answer: "", isCorrect: false });
			return updatedQuestions;
		});
	};

	const handleToggleCorrectAnswer = (answerIndex: number, questionIndex: number) => {
		setQuestions((prevQuestions) => {
			const updatedQuestions = [...prevQuestions];
			updatedQuestions[questionIndex].answers[answerIndex].isCorrect =
				!updatedQuestions[questionIndex].answers[answerIndex].isCorrect;
			return updatedQuestions;
		});
	};

	return (
		<div className="flex flex-col gap-10 p-10 w-full ml-[210px]">
			<SearchBar />
			<div className="flex flex-col border-slate-200 border-b">
				<h1 className="text-2xl font-bold text-zinc-800">Create a test</h1>
				<p className="text-slate-400 text-sm pt-3 pb-3">
					Great! Now compose your test - add questions answers to each of them. Each question must
					have at least one correct answer.
				</p>
				<div className="flex gap-5 mb-2 p-2">
					<Input
						placeholder="Insert test name..."
						onChange={(e) => setTestTitle(e.target.value)}
						className="bg-slate-200"
						value={testTitle}
					/>
					<Button className="bg-red-500 hover:bg-red-600 truncate" onClick={handleDeleteTest}>
						Reset
					</Button>
				</div>
			</div>
			{questions.map((question, questionIndex) => {
				return (
					<Question
						question={question}
						questionIndex={questionIndex}
						onQuestionChange={handleQuestionChange}
						onQuestionDelete={handleQuestionDelete}
						onAnswerChange={handleAnswerChange}
						onAnswerDelete={handleAnswerDelete}
						toggleAnswerCorrect={handleToggleCorrectAnswer}
						onAnswerAdd={handleAddAnswer}
					/>
				);
			})}
			<div
				className="flex bg-blue-200 text-blue-500 font-bold p-5 text-xl justify-center hover:bg-blue-500 hover:text-white cursor-pointer"
				onClick={handleAddQuestion}
			>
				Add question +
			</div>
		</div>
	);
};

export default Create;
