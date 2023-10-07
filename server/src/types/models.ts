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
	defaultQuestionType: QuestionVariantsType["type"]
	createdAt: Date;
	updatedAt?: Date;
	authorId?: string;
	author?: UserType;
	collaboratorEmails?: string[];
	collaborators?: UserType[];
	questions: QuestionType[];
}

export interface QuestionVariantsType{
	type: "MULTIPLE_CHOICE" | "CODE"
}

export interface QuestionType {
	id: string;
	type: QuestionVariantsType["type"]
	question: string;
	imageUrl?: string;
	createdAt: Date;
}

export interface MultipleChoiceQuestionType extends QuestionType{
	answers: AnswerType[];

}

export interface CodeQuestionType extends QuestionType{
	correctCode: string,
	description?: string,
	showCorrectCodeOnResults: boolean

}

export interface AnswerType {
	id: string;
	answer: string;
	isCorrect: boolean;
	createdAt: Date;
}

export type OptionType = {
	label: string;
	value: string;
};

export interface EventType {
	event_id: string | number;
	title: string;
	description: string;
	start: Date | string;
	end: Date | string;
	allDay: boolean | undefined;
	color: string;
	repeatPattern: "none" | "daily" | "weekly" | "monthly";
	selectedTests: OptionType[]
}
