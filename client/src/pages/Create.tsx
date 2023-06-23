import { useState } from "react";
import Question from "../components/Question";
import SearchBar from "../components/SearchBar";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { QuestionType } from "../types/models";

const Create = () => {
	const [testTitle, setTestTitle] = useState<string>("");
	const [questions, setQuestions] = useState<QuestionType[]>([{question:"",answers:[{answer:"",isCorrect:false}]}])

	const handleDeleteTest = () => {
		//trigger a confirmation modal and push test to db
	}

	return (
		<div className="flex flex-col gap-10 p-10 w-full">
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
					/>
					<Button className="bg-red-500 hover:bg-red-600 truncate" onClick={handleDeleteTest}>
						Reset
					</Button>
				</div>
			</div>
			{questions.map((question) => {
				return <Question/>
			})}
		</div>
	);
};

export default Create;
