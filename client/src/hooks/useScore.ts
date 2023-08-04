import { useEffect, useState } from "react";
import { CodeQuestionType, MultipleChoiceQuestionType, QuestionType } from "../types/models";

interface UserScore {
	value: number;
	percentage: number;
}

const initialUserScore:UserScore = {
    value: 0,
    percentage: 0
}

export const useScore = (questions:QuestionType[], userAnswers:(boolean[] | string)[]) => {
	const [userScore, setUserScore] = useState<UserScore>(initialUserScore);
	const [maxScore, setMaxScore] = useState<number>(0);

	useEffect(() => {
		let answeredCorrect: number = 0;
		let maxScore: number = 0;
		questions.map((question, questionIndex) => {
			if(question.type === "MULTIPLE_CHOICE"){
				(question as MultipleChoiceQuestionType).answers.map((answer, answerIndex) => {
					if (answer.isCorrect) {
						maxScore++;
					}
	
					if (answer.isCorrect && userAnswers[questionIndex][answerIndex]) {
						answeredCorrect++;
					}
				});
			}
			else if(question.type === "CODE"){
				maxScore++;
				/**
				 * This logic needs to implement openai' api to have chatgpt compare the 2 code samples and based on the result give points,
				 * currently it only checks if the code is identical
				 */
				if((question as CodeQuestionType).correctCode === userAnswers[questionIndex]){
					answeredCorrect++;
				}
			}

			
		});
		setUserScore({
			value: answeredCorrect,
			percentage: Math.floor((answeredCorrect / maxScore) * 100),
		});
		setMaxScore(maxScore);
	}, []);

    return {userScore, maxScore}
};
