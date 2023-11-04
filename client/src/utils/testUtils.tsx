import { Fragment } from "react";
import { CodeQuestionType, MultipleChoiceQuestionType, TestType } from "../../../shared/models";

export function validateTest(
	test: TestType,
	setTest: React.Dispatch<React.SetStateAction<TestType>>
) {
	let testValid: boolean = true;
	let messages: string[] = [];

	if (test.title.length < 1) {
		testValid = false;
		messages.push("Test needs to have a title!");
	}

	if (test.questions.length < 2) {
		testValid = false;
		messages.push("Test needs to have at least 2 questions!");
	}

	test.questions.map((question) => {
		if (!question.question) {
			testValid = false;
			messages.push("Question cannot be empty!");
		}

		if (question.type === "MULTIPLE_CHOICE") {
			if ((question as MultipleChoiceQuestionType).answers.length < 2) {
				testValid = false;
				messages.push("Question must have at least 2 answers!");
			}

			(question as MultipleChoiceQuestionType).answers.map((answer) => {
				if (!answer.answer && (question as MultipleChoiceQuestionType).answers.length < 3) {
					testValid = false;
					messages.push("Answer cannot be empty!");
					return;
				}
			});
		} else if (question.type === "CODE") {
			if (!(question as CodeQuestionType).correctCode) {
				testValid = false;
				messages.push("Question must have correct code!");
			}
		}
	});

	if (testValid) {
		setTest((prevTest) => {
			let updatedTest = { ...prevTest };
			updatedTest.questions.forEach((question, questionIndex) => {
				if (question.type === "MULTIPLE_CHOICE") {
					(question as MultipleChoiceQuestionType).answers.forEach((answer, answerIndex) => {
						if (answer.answer === "") {
							(updatedTest.questions[questionIndex] as MultipleChoiceQuestionType).answers.splice(
								answerIndex,
								1
							);
						}
					});
				}
			});
			return updatedTest;
		});
	}

	return { testValid, messages };
}

export function shuffleArray<T>(array: T[]): T[] {
	const shuffledArray = [...array];

	for (let i = shuffledArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
	}

	return shuffledArray;
}

export function randomizeTest(test: TestType) {
	const randomizedTest = { ...test };
	if (test.randomizeQuestions) {
		randomizedTest.questions = shuffleArray(test.questions);
	}
	if (test.randomizeAnswers) {
		randomizedTest.questions = randomizedTest.questions.map((prevQuestion) => {
			if (prevQuestion.type === "MULTIPLE_CHOICE") {
				return {
					...prevQuestion,
					answers: shuffleArray((prevQuestion as MultipleChoiceQuestionType).answers),
				};
			} else {
				return prevQuestion;
			}
		});
	}

	return randomizedTest as TestType;
}

export function renderTextWithLineBreaks(text: string) {
	// Replace new line characters with <br> tags
	return text
		? text.split("\n").map((line, index) => (
				<Fragment key={index}>
					{line}
					<br />
				</Fragment>
		  ))
		: null;
}

export function parseQuestionType(type: string): string {
	let formattedType = type.toLowerCase().replace("_", " ");
	return formattedType.charAt(0).toUpperCase() + formattedType.slice(1);
}

export function formatLinks(text: string) {
	const urlPattern = /(https?:\/\/[^\s]+)/g;
	const segments = text.split(urlPattern);
	return segments.map((segment, index) => {
		if (segment.match(urlPattern)) {
			return (
				<a key={index} href={segment} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline dark:text-blue-300">
					{segment}
				</a>
			);
		} else {
			return <span key={index}>{segment}</span>;
		}
	});
}
