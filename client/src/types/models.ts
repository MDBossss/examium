export interface UserType{
    id:string,
    firstName: string,
    lastName: string,
    email:string,
    imageUrl?:string
}

export interface TestType{
    id:string,
    title:string,
    description:string,
    passCriteria: number,
    showQuestionsOnResults: boolean,
    randomizeQuestions:boolean,
    randomizeAnswers:boolean,
    questions: QuestionType[],
    author?: UserType,
    createdAt: number,
    lastUpdatedAt?: number
}

export interface QuestionType{
    id:string,
    question: string,
    answers: AnswerType[],
    imageUrl?: string,
}

export interface AnswerType{
    id:string,
    answer:string,
    isCorrect:boolean,
}