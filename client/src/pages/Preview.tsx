import { useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { TestType } from "../types/models";
import { useState } from "react";
import QuizAnswer from "../components/QuizAnswer";
import { Button } from "../components/ui/button";

const Preview = () => {
  const location = useLocation();
  const test: TestType = location.state?.test;
  const [questionNumber, setQuestionNumber] = useState<number>(0);

  const handleIncrementQuestion = () => {
    setQuestionNumber((prev) => prev + 1);
  };

  const handleDecrementQuestion = () => {
    setQuestionNumber((prev) => prev - 1);
  };

  const handleFinishTest = () => {};

  return (
    <div className="flex flex-col gap-10 p-10 pt-5 w-full ml-[210px]">
      <SearchBar />
      <div className=" max-w-5xl mx-auto flex gap-5 flex-col w-full items-center bg-slate-200 p-7">
        <h2 className="text-md font-medium text-blue-500">{test.title}</h2>
        {test.questions[questionNumber].imageUrl && (
          <div className="w-full">
            <img src={`${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${test.questions[questionNumber].imageUrl}`} className="w-full"/>
          </div>
        )}
        <h1 className="text-2xl font-bold text-center">
          {test.questions[questionNumber].question}
        </h1>
        <div className="grid grid-cols-2 w-full gap-3">
          {test.questions[questionNumber].answers.map((answer) =>
            answer.answer.length ? <QuizAnswer answer={answer} /> : null
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

          {questionNumber !== test.questions.length - 1 && (
            <Button
              className="flex-1 py-7 bg-blue-500 hover:bg-blue-600"
              onClick={handleIncrementQuestion}
            >
              Next question
            </Button>
          )}
        </div>
        <div className="flex w-full gap-3">
          {questionNumber == test.questions.length - 1 && (
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
