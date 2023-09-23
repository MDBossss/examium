import { v4 as uuidv4 } from "uuid";
import { AnswerType, CodeQuestionType, MultipleChoiceQuestionType, QuestionVariantsType, TestType, UserType } from "../types/models";
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

	const generateQuestion = (type: QuestionVariantsType["type"]): CodeQuestionType | MultipleChoiceQuestionType => {
		return (type === "CODE") ? {
			id: uuidv4(),
			type: type,
			question: "",
			createdAt: new Date(),
			correctCode: "",
			showCorrectCodeOnResults: true

		} as CodeQuestionType : {
			id: uuidv4(),
			type: type,
			question: "",
			createdAt: new Date(),
			answers: [generateAnswer()]
		} as MultipleChoiceQuestionType
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
			defaultQuestionType: "MULTIPLE_CHOICE",
			createdAt: new Date(),
			questions: [generateQuestion("MULTIPLE_CHOICE")],
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
