import { useEffect, useState } from "react";
import { CodeAnswer, MultipleChoiceQuestionType, QuestionType } from "../../../shared/models";

interface UserScore {
	value: number;
	percentage: number;
}

const initialUserScore:UserScore = {
    value: 0,
    percentage: 0
}

export const useScore = (questions:QuestionType[], userAnswers:(boolean[] | CodeAnswer)[]) => {
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
	
					if (answer.isCorrect && (userAnswers[questionIndex] as boolean[])[answerIndex]) {
						answeredCorrect++;
					}
				});
			}
			else if(question.type === "CODE"){
				maxScore++;
				if((userAnswers[questionIndex] as CodeAnswer).isCorrect){
					answeredCorrect++;
				}
			}

			
		});
		setUserScore({
			value: answeredCorrect,
			percentage: Math.floor((answeredCorrect / maxScore) * 100),
		});
		setMaxScore(maxScore);
	}, [userAnswers]);

    return {userScore, maxScore}
};
