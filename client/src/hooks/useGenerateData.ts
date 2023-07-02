import { v4 as uuidv4 } from "uuid";
import { AnswerType, QuestionType, TestType } from "../types/models";

const useGenerateData = () => {
	const generateAnswer = () => {
		return {
			id: uuidv4(),
			answer: "",
			isCorrect: false,
		} as AnswerType;
	};

	const generateQuestion = () => {
		return {
			id: uuidv4(),
			question: "",
			answers: [generateAnswer()],
		} as QuestionType;
	};

	const generateTest = () => {
		return {
			id: uuidv4(),
			title: "",
			description: "",
			passCriteria: 50,
			showQuestionsOnResults: true,
			randomizeQuestions: false,
			randomizeAnswers: false,
			createdAt: Date.now(),
			questions: [generateQuestion()],
		} as TestType;
	};

	return {
		generateTest,
		generateQuestion,
		generateAnswer,
	};
};

export default useGenerateData;
