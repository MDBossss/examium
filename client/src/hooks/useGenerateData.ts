import { v4 as uuidv4 } from "uuid";
import { AnswerType, QuestionType, TestType, UserType } from "../types/models";
import {UserResource} from "@clerk/types"


const useGenerateData = () => {
	const generateAnswer = (): AnswerType => {

		return {
			id: uuidv4(),
			answer: "",
			isCorrect: false,
			createdAt: new Date(),
		}
	};

	const generateQuestion = (): QuestionType => {
		return {
			id: uuidv4(),
			question: "",
			createdAt: new Date(),
			answers: [generateAnswer()],
		} 
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
			createdAt: new Date(),
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
