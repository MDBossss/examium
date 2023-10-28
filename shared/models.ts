export interface UserType {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	imageUrl: string;
	locationName: string;
	longitude: number;
	latitude: number;
}

export interface TestType {
	id: string;
	title: string;
	description: string;
	passCriteria: number;
	showQuestionsOnResults: boolean;
	randomizeQuestions: boolean;
	randomizeAnswers: boolean;
	defaultQuestionType: QuestionVariantsType;
	createdAt: Date;
	updatedAt?: Date;
	authorId?: string;
	author?: UserType;
	collaboratorEmails?: string[];
	collaborators?: UserType[];
	questions: QuestionType[];
}

export type QuestionVariantsType = "MULTIPLE_CHOICE" | "CODE";


export interface QuestionType {
	id: string;
	type: QuestionVariantsType;
	question: string;
	imageUrl?: string;
	createdAt: Date;
}

export interface MultipleChoiceQuestionType extends QuestionType {
	answers: AnswerType[];
}

export interface CodeQuestionType extends QuestionType {
	correctCode: string;
	description?: string;
	showCorrectCodeOnResults: boolean;
}

export interface AnswerType {
	id: string;
	answer: string;
	isCorrect: boolean;
	createdAt: Date;
}

export interface CodeAnswer {
	userCode: string;
	isCorrect: boolean;
}

export type OptionType = {
	label: string;
	value: string;
};

export type RepeatPattern = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";

export interface EventType {
	event_id: string | number;
	title: string;
	description: string;
	location: string;
	start: Date | string;
	end: Date | string;
	allDay: boolean | undefined;
	color: string;
	repeatPattern: RepeatPattern
	testOptions: OptionType[];
	selectedTests?: TestType[];
}

export interface LocationType {
	name: string;
	longitude: number;
	latitude: number;
}

export interface StudyGroupType{
	id: string;
	name: string;
	description:string;
	imageUrl: string;
	isPublic: boolean;
	ownerId: string;
	owner?: UserType;
	memberCount?: number;
	members?:MemberType[];
	messages?: MessageType[]
	createdAt?: Date
	updatedAt?: Date
}

export interface MemberType{
	id:string
	userId: string,
	user:UserType,
}

export interface MessageType{
	id:string;
	content:string;
	fileUrl?: string | null;
	testId?: string | null;
	memberId?: string;
	studyGroupId?:string;
	member?:MemberType;
	test?:TestType
	deleted: boolean
}

export interface WeatherDataType {
	latitude: number;
	longitude: number;
	generationtime_ms: number;
	utc_offset_seconds: number;
	timezone: string;
	timezone_abbreviation: string;
	elevation: number;
	current_units: {
		time: string;
		interval: string;
		temperature_2m: string;
		relativehumidity_2m: string;
		apparent_temperature: string;
		is_day: string;
		weathercode: string;
		windspeed_10m: string;
	};
	current: {
		time: string;
		interval: number;
		temperature_2m: number;
		relativehumidity_2m: number;
		apparent_temperature: number;
		is_day: number;
		weathercode: number;
		windspeed_10m: number;
	};
	daily_units: {
		time: string;
		weathercode: string;
		temperature_2m_max: string;
		temperature_2m_min: string;
	};
	daily: {
		time: string[];
		weathercode: number[];
		temperature_2m_max: number[];
		temperature_2m_min: number[];
	};
}
