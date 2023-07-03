import { v4 as uuidv4 } from "uuid";
import { AnswerType, QuestionType, TestType, UserType } from "../types/models";
import {UserResource} from "@clerk/types"


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

	const generateUser = (clerkUser: UserResource) => {
		return {
			id: clerkUser.id,
			firstName: clerkUser.firstName,
			lastName: clerkUser.lastName,
			email: clerkUser.primaryEmailAddress?.emailAddress,
			imageUrl: clerkUser.imageUrl
		} as UserType
	}

	return {
		generateTest,
		generateQuestion,
		generateAnswer,
		generateUser
	};
};

export default useGenerateData;
