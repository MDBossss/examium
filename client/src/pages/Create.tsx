import { useEffect, useState } from "react";
import Question from "../components/Question";
import SearchBar from "../components/SearchBar";
import { Input } from "../components/ui/input";
import { TestType } from "../types/models";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alertDialog";
import { useNavigate } from "react-router-dom";

const initialValue: TestType = {
  title: "",
  createdAt: Date.now(),
  questions: [{ question: "", answers: [{ answer: "", isCorrect: false }] }],
};

const Create = () => {
  const [test, setTest] = useState<TestType>(initialValue);
  const navigate = useNavigate();

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
    setTest((prevTest) => ({
      ...prevTest,
      title:title
    }))
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
    <div className="flex flex-col gap-10 p-10 pt-5 w-full ml-[210px]">
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
            className="bg-slate-200"
            value={test.title}
          />
          <AlertDialog>
            <AlertDialogTrigger className="bg-red-500 hover:bg-red-600 text-white inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 py-2 px-4">
              Reset
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will delete all the
                  progress you made on this test.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={handleDeleteTest}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
