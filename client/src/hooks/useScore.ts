import { useEffect, useState } from "react";
import { QuestionType } from "../types/models";

interface UserScore {
	value: number;
	percentage: number;
}

const initialUserScore:UserScore = {
    value: 0,
    percentage: 0
}

export const useScore = (questions:QuestionType[], answersChecked:boolean[][]) => {
	const [userScore, setUserScore] = useState<UserScore>(initialUserScore);
	const [maxScore, setMaxScore] = useState<number>(0);

	useEffect(() => {
		let answeredCorrect: number = 0;
		let maxScore: number = 0;
		questions.map((question, questionIndex) => {
			question.answers.map((answer, answerIndex) => {
				if (answer.isCorrect) {
					maxScore++;
				}

				if (answer.isCorrect && answersChecked[questionIndex][answerIndex]) {
					answeredCorrect++;
				}
			});
		});
		setUserScore({
			value: answeredCorrect,
			percentage: Math.floor((answeredCorrect / maxScore) * 100),
		});
		setMaxScore(maxScore);
	}, []);

    return {userScore, maxScore}
};
