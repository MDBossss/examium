import React from "react";
import { TestType } from "../types/models";

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

	if (testValid) {
		setTest((prevTest) => {
			let updatedTest = { ...prevTest };
			updatedTest.questions.forEach((question, questionIndex) => {
				question.answers.forEach((answer, answerIndex) => {
					if (answer.answer === "") {
						updatedTest.questions[questionIndex].answers.splice(answerIndex, 1);
					}
				});
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
		randomizedTest.questions = randomizedTest.questions.map((prevQuestion) => ({
			...prevQuestion,
			answers: shuffleArray(prevQuestion.answers),
		}));
	}

	return randomizedTest as TestType;
}

export function renderTextWithLineBreaks(text: string){
    // Replace new line characters with <br> tags
    return text.split('\n').map((line, index) => <React.Fragment key={index}>{line}<br/></React.Fragment>);
  };