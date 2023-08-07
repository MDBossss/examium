import { useEffect, useState } from "react";
import { QuestionType } from "../types/models";

export const useQuestionCount = (questions: QuestionType[]) => {
	const [codeQuestionCount, setCodeQuestionCount] = useState<number>(0);
	const [multipleAnswerQuestionCount, setMultipleAnswerQuestionCount] = useState<number>(0);

	useEffect(() => {
		questions.map((question) => {
			if (question.type === "CODE") {
				setCodeQuestionCount((prev) => prev + 1);
			} else if (question.type === "MULTIPLE_CHOICE") {
				setMultipleAnswerQuestionCount((prev) => prev + 1);
			}
		});
	}, []);

	return { codeQuestionCount, multipleAnswerQuestionCount };
};
