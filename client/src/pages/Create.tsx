import { useState } from "react";
import Question from "../components/Question";
import SearchBar from "../components/SearchBar";
import { Input } from "../components/ui/input";
import { QuestionType, TestType } from "../types/models";
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

const initialValue: TestType = {
  title: "",
  createdAt: Date.now(),
  questions: [
    { question: "", answers: [{ answer: "", isCorrect: false }] },
  ]

}

const Create = () => {
  const [test,setTest] = useState<TestType>(initialValue);
  const [testTitle, setTestTitle] = useState<string>("");
  const [questions, setQuestions] = useState<QuestionType[]>([
    { question: "", answers: [{ answer: "", isCorrect: false }] },
  ]);

  const handlePreviewTest = () => {
    //check if title is set, at least 2 questions, and if user is logged in
    //ir user not logged in display login modal first
    //navigate to /preview and pass test object with react router
  }

  const handleDeleteTest = () => {
    setTestTitle("");
    setQuestions([
      { question: "", answers: [{ answer: "", isCorrect: false }] },
    ]);
  };

  const handleSetQuestionImage = (imageUrl:string | undefined, questionIndex: number) => {
    setTest((prevTest) => {
      prevTest.questions[questionIndex].imageUrl = imageUrl;
      return prevTest
    })

	setQuestions((prevQuestions) => {
		const updatedQuestions = [...prevQuestions];
		updatedQuestions[questionIndex].imageUrl = imageUrl;
		return updatedQuestions;
	  });
  }

  const handleQuestionChange = (text: string, questionIndex: number) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].question = text;
      return updatedQuestions;
    });
  };

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => {
      return [
        ...prevQuestions,
        { question: "", answers: [{ answer: "", isCorrect: false }] },
      ];
    });
  };

  const handleQuestionDelete = (questionIndex: number) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions.splice(questionIndex, 1);
      return updatedQuestions;
    });
  };

  const handleAnswerChange = (
    text: string,
    answerIndex: number,
    questionIndex: number
  ) => {
    if (answerIndex === questions[questionIndex].answers.length - 1) {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[questionIndex].answers.push({
          answer: "",
          isCorrect: false,
        });
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
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].answers.push({
        answer: "",
        isCorrect: false,
      });
      return updatedQuestions;
    });
  };

  const handleToggleCorrectAnswer = (
    answerIndex: number,
    questionIndex: number
  ) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].answers[answerIndex].isCorrect =
        !updatedQuestions[questionIndex].answers[answerIndex].isCorrect;
      return updatedQuestions;
    });
  };

  return (
    <div className="flex flex-col gap-10 p-10 pt-5 w-full ml-[210px]">
      <SearchBar />
      <div className="flex flex-col border-slate-200 border-b">
        <h1 className="text-2xl font-bold text-zinc-800">Create a test</h1>
        <p className="text-slate-400 text-sm pt-3 pb-3">
          Great! Now compose your test - add questions answers to each of them.
          Each question must have at least one correct answer.
        </p>
        <div className="flex gap-5 mb-2 p-2">
          <Input
            placeholder="Insert test name..."
            onChange={(e) => setTestTitle(e.target.value)}
            className="bg-slate-200"
            value={testTitle}
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
      {questions.map((question, questionIndex) => {
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
