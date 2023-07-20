export interface UserType {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	imageUrl: string;
}

export interface TestType {
	id: string;
	title: string;
	description: string;
	passCriteria: number;
	showQuestionsOnResults: boolean;
	randomizeQuestions: boolean;
	randomizeAnswers: boolean;
	createdAt: Date;
	updatedAt?: Date;
	authorId?: string;
	author: UserType;
	collaboratorEmails?: string[];
	collaborators?: UserType[];
	questions: QuestionType[];
}

export interface QuestionType {
	id: string;
	question: string;
	imageUrl?: string;
	createdAt: Date;
	answers: AnswerType[];
}

export interface AnswerType {
	id: string;
	answer: string;
	isCorrect: boolean;
	createdAt: Date;
}
