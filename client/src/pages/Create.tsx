import { useEffect, useState } from "react";
import Question from "../components/Question";
import SearchBar from "../components/SearchBar";
import { Input } from "../components/ui/Input";
import { TestType } from "../types/models";
import { useNavigate } from "react-router-dom";
import ResetDialog from "../components/ui/Dialogs/ResetDialog";
import SettingsDialog from "../components/ui/Dialogs/SettingsDialog";
import {z} from "zod";
import { useToast } from "../hooks/useToast";

const initialValue: TestType = {
  title: "",
  description: "",
  passCriteria: 50,
  showQuestionsOnResults: true,
  randomizeQuestions: false,
  randomizeAnswers: false,
  createdAt: Date.now(),
  questions: [{ question: "", answers: [{ answer: "", isCorrect: false }] }],
};

const titleSchema = z.string().max(50, { message: "Title must be at most 50 characters" });

const Create = () => {
  const [test, setTest] = useState<TestType>(initialValue);
  const [titleError,setTitleError] = useState<boolean>(false);
  const navigate = useNavigate();
  const {toast} = useToast();

  const handlePreviewTest = () => {
    sessionStorage.setItem("test",JSON.stringify(test));

    //check if title is set, at least 2 questions, and if user is logged in
    //ir user not logged in display login modal first
    //navigate to /preview and pass test object with react router
    navigate("/create/preview", {state: {test}})
  };

  useEffect(() => {
		const testJSON = sessionStorage.getItem("test")
		if(testJSON && setTest){
			let test: TestType = JSON.parse(testJSON)
			setTest(test)
			sessionStorage.removeItem("test");
		}
	},[])

  const handleDeleteTest = () => {
    setTest(initialValue);
  };


  const handleSetTestTitle = (title: string) => {
    try{
      titleSchema.parse(title);
      setTitleError(false)
      setTest((prevTest) => ({
        ...prevTest,
        title:title
      }))
    }catch(error){
      setTitleError(true)
      console.log(error)
      toast({
				description: "Title is at most 50 characters",
				variant: "destructive",
			});
    }
  };


  const handleSetQuestionImage = (
    imageUrl: string | undefined,
    questionIndex: number
  ) => {
    setTest((prevTest) => {
      let updatedTest = {...prevTest}
      updatedTest.questions[questionIndex].imageUrl = imageUrl;
      return updatedTest;
    });
  };

  const handleQuestionChange = (text: string, questionIndex: number) => {
    setTest((prevTest) => {
      let updatedTest = {...prevTest}
      updatedTest.questions[questionIndex].question = text;
      return updatedTest;
    });
  };

  const handleAddQuestion = () => {
    setTest((prevTest) => {
      let updatedTest = {...prevTest}
      updatedTest.questions.push({
        question: "",
        answers: [{ answer: "", isCorrect: false }],
      });
      return updatedTest;
    });
  };

  const handleQuestionDelete = (questionIndex: number) => {
    setTest((prevTest) => {
      let updatedTest = {...prevTest}
      updatedTest.questions.splice(questionIndex, 1);
      return updatedTest;
    });
  };

  const handleAnswerChange = (
    text: string,
    answerIndex: number,
    questionIndex: number
  ) => {
    if (answerIndex === test.questions[questionIndex].answers.length - 1) {
      setTest((prevTest) => {
        let updatedTest = {...prevTest}
        updatedTest.questions[questionIndex].answers.push({
          answer: "",
          isCorrect: false,
        });
        return updatedTest;
      });
    }

    setTest((prevTest) => {
      let updatedTest = {...prevTest}
      updatedTest.questions[questionIndex].answers[answerIndex].answer = text;
      return updatedTest;
    });
  };

  const handleAnswerDelete = (answerIndex: number, questionIndex: number) => {
    setTest((prevTest) => {
      let updatedTest = {...prevTest}
      updatedTest.questions[questionIndex].answers.splice(answerIndex, 1);
      return updatedTest;
    });
  };

  const handleAddAnswer = (questionIndex: number) => {
    setTest((prevTest) => {
      let updatedTest = prevTest;
      updatedTest.questions[questionIndex].answers.push({
        answer: "",
        isCorrect: false,
      });
      return updatedTest;
    });
  };

  const handleToggleCorrectAnswer = (
    answerIndex: number,
    questionIndex: number
  ) => {
    setTest((prevTest) => {
      let updatedTest = {...prevTest}
      updatedTest.questions[questionIndex].answers[answerIndex].isCorrect =
        !updatedTest.questions[questionIndex].answers[answerIndex].isCorrect;
      return updatedTest;
    });
  };

  return (
    <div className="flex flex-col gap-10 p-10 pt-5 w-full">
      <SearchBar test={test} setTest={setTest} />
      <div className="flex flex-col border-slate-200 border-b">
        <h1 className="text-2xl font-bold text-zinc-800">Create a test</h1>
        <p className="text-slate-400 text-sm pt-3 pb-3">
          Great! Now compose your test - add questions answers to each of them.
          Each question must have at least one correct answer.
        </p>
        <div className="flex gap-5 mb-2 p-2">
          <Input
            placeholder="Insert test name..."
            onChange={(e) => handleSetTestTitle(e.target.value)}
            className={`${titleError && "focus-visible:ring-red-500"} bg-slate-200`}
            value={test.title}
          />
          <SettingsDialog test={test} setTest={setTest}/>
          <ResetDialog onTrigger={handleDeleteTest}/>
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
