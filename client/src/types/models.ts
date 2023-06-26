export interface UserType{
    id?:number,
    firstName: string,
    lastName: string,
    email:string,
    imageUrl?:string
}

export interface TestType{
    id?:number,
    title:string
    questions: QuestionType[],
    author?: UserType,
    createdAt: number,
    lastUpdatedAt?: number
}

export interface QuestionType{
    id?:number
    question: string,
    answers: AnswerType[],
    imageUrl?: string,
}

export interface AnswerType{
    id?:number,
    answer:string,
    isCorrect:boolean,
}