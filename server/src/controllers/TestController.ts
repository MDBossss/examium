import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { CodeQuestionType, MultipleChoiceQuestionType, TestType } from "../types/models";

class TestController {
	async getAllTests(req: Request, res: Response) {
		try {
			const tests = await prisma.test.findMany();
			if (!tests || tests.length === 0) {
				return res.status(404).json({ error: "No tests found." });
			}
			res.status(200).json(tests);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	//gets all the tests the user is collaborating on
	async getCollaborationTestsByUserId(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const tests = await prisma.test.findMany({
				where: {
					collaborators: {
						some: {
							id: id,
						},
					},
				},
				include: {
					collaborators: true,
					author: true,
				},
			});
			if (!tests || tests.length === 0) {
				return res.status(404).json({ error: "No tests found." });
			}
			res.status(200).json(tests);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async getTestsByUserId(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const tests = await prisma.test.findMany({
				where: {
					authorId: id,
				},
				include: {
					author: true,
				},
			});
			if (!tests || tests.length === 0) {
				return res.status(404).json({ error: "No tests found." });
			}
			res.status(200).json(tests);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async getTestById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const test = await prisma.test.findUnique({
				where: { id },
				include: {
					questions: {
						orderBy: {
							createdAt: "asc",
						},
						include: {
							multipleChoiceQuestion: {
								include: {
									answers: {
										orderBy: {
											createdAt: "asc",
										},
									},
								},
							},
							codeQuestion: true,
						},
					},
					collaborators: true,
					author: true,
				},
			});

			if (!test) {
				return res.status(404).json({ error: "Test not found" });
			}

			// Transform the questions to include their type and specific properties
			const testWithQuestions = {
				...test,
				questions: test.questions.map((question) => {
					const type = question.type; // Assuming the question has a 'type' field in the database
					const data =
						type === "multiple-choice" ? question.multipleChoiceQuestion : question.codeQuestion;
					return {
						...question,
						type,
						data,
					};
				}),
			};

			const testWithCollaborators = {
				...testWithQuestions,
				collaboratorEmails: test.collaborators.map((collaborator) => collaborator.email),
			};

			res.status(200).json(testWithCollaborators);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async createTest(req: Request, res: Response) {
		try {
			const {
				id,
				title,
				description,
				passCriteria,
				showQuestionsOnResults,
				randomizeQuestions,
				randomizeAnswers,
				createdAt,
				questions,
				collaboratorEmails,
				authorId,
			}: TestType = req.body;

			const newTest = await prisma.test.create({
				data: {
					id,
					title,
					description,
					passCriteria,
					showQuestionsOnResults,
					randomizeQuestions,
					randomizeAnswers,
					createdAt,
					author: {
						connect: { id: authorId! },
					},
					questions: {
						create: questions.map((q) => {
							if (q.type === "MULTIPLE_CHOICE") {
								const { id, type, question, imageUrl, createdAt, answers } =
									q as MultipleChoiceQuestionType;

								return {
									id,
									type,
									question,
									imageUrl,
									createdAt,
									multipleChoiceQuestion: {
										create: {
											questionId: id,
											answers: {
												create: answers.map((answer) => ({
													id: answer.id,
													answer: answer.answer,
													isCorrect: answer.isCorrect,
													createdAt: answer.createdAt,
												})),
											},
										},
									},
								};
							} else if (q.type === "CODE") {
								const { id, type, question, imageUrl, createdAt, description, correctCode } =
									q as CodeQuestionType;

								return {
									id,
									type,
									question,
									imageUrl,
									createdAt,
									codeQuestion: {
										create: {
											correctCode,
										},
									},
								};
							} else {
								throw new Error(`Unrecognized question type: ${q.type}`);
							}
						}),
					},
					collaborators: {
						connect: collaboratorEmails?.map((email) => ({ email })),
					},
				},
			});

			res.status(201).json(newTest);
		} catch (error) {
			console.error("Error creating test:", error);
			res.status(500).json({ error: "Failed to create test" });
		}
	}

	async updateTest(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const {
				title,
				description,
				passCriteria,
				showQuestionsOnResults,
				randomizeQuestions,
				randomizeAnswers,
				createdAt,
				questions,
				collaboratorEmails,
				authorId,
			}: TestType = req.body;

			const questionsForTest = await prisma.question.findMany({
				where: {
					testId: id,
				},
				select: {
					id: true,
				},
			});

			const questionIdsForTest = questionsForTest.map((question) => question.id);

			//Delete outdated answers
			await prisma.answer.deleteMany({
				where: {
					questionId: {
						in: questionIdsForTest,
					},
				},
			});

			// Delete outdated questions
			await prisma.question.deleteMany({
				where: {
					testId: id,
					NOT: {
						id: {
							in: questions.map((question) => question.id).filter(Boolean),
						},
					},
				},
			});

			const updatedQuestions = await Promise.all(
				questions.map((question) => createOrUpdateQuestion(question))
			);

			const updatedTest = await prisma.test.update({
				where: { id },
				data: {
					title,
					description,
					passCriteria,
					showQuestionsOnResults,
					randomizeQuestions,
					randomizeAnswers,
					createdAt,
					author: {
						connect: { id: authorId! },
					},
					questions: {
						upsert: questions.map((question) => ({
							where: { id: question.id },
							create: {
								type: question.type,
								question: question.question,
								imageUrl: question.imageUrl,
								multipleChoiceQuestion: question.type === 'MULTIPLE_CHOICE' ? {
									create: {
									answers: {
										create: (question as MultipleChoiceQuestionType).answers.map((answer) => ({
										answer: answer.answer,
										isCorrect: answer.isCorrect,
										})),
									},
									},
								} : undefined,
								codeQuestion: question.type === 'CODE' ? {
									create: {
									correctCode: (question as CodeQuestionType).correctCode,
									},
								} : undefined,
							},
							update: {
								type: question.type,
								question: question.question,
								imageUrl: question.imageUrl,
								createdAt: question.createdAt,
								multipleChoiceQuestion: question.type === "MULTIPLE_CHOICE" ? {
									upsert:{
										create:{
											answers:{
												create: (question as MultipleChoiceQuestionType).answers.map((answer) => ({
													answer:answer.answer,
													isCorrect: answer.isCorrect,
													createdAt: answer.createdAt
												}))
											}
										},
										update:{
											answers:{
												upsert: (question as MultipleChoiceQuestionType).answers.map((answer) => ({
													where: {id: answer.id},
													create:{
														answer:answer.answer,
														isCorrect: answer.isCorrect,
														createdAt: answer.createdAt
													},
													update:{
														answer:answer.answer,
														isCorrect: answer.isCorrect,
														createdAt: answer.createdAt
													}
												}))
											}
										}
									}
								} : undefined,
								codeQuestion: question.type === "CODE" ? {
									upsert:{
										create:{
											correctCode: (question as CodeQuestionType).correctCode,
										},
										update:{
											correctCode: (question as CodeQuestionType).correctCode,
										}
									}
								}: undefined
							},
						})),
					},

					collaborators: {
						set: collaboratorEmails?.map((email) => ({ email })),
					},
				},
				include: {
					author: true,
					questions: {
						include: {
							multipleChoiceQuestion: true,
							codeQuestion: true
						},
					},
					collaborators: true,
				},
			});

			res.status(200).json(updatedTest);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async deleteTest(req: Request, res: Response) {
		try {
			const { id } = req.params;
			await prisma.test.delete({
				where: { id },
				include: {
					author: true,
					questions: {
						include: {
							answers: true,
						},
					},
					collaborators: true,
				},
			});
			res.status(204).json({ message: "Test deleted successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
}

async function createOrUpdateQuestion(
	question: MultipleChoiceQuestionType | CodeQuestionType | QuestionType
) {
	if (question.type === "MULTIPLE_CHOICE") {
		const {
			id,
			type,
			question: questionText,
			imageUrl,
			createdAt,
			answers,
		} = question as MultipleChoiceQuestionType;

		return prisma.question.upsert({
			where: { id },
			create: {
				type,
				question: questionText,
				imageUrl,
				createdAt,
				multipleChoiceQuestion: {
					create: {
						answers: {
							createMany: {
								data: answers.map((answer) => ({
									answer: answer.answer,
									isCorrect: answer.isCorrect,
									createdAt: answer.createdAt,
								})),
							},
						},
					},
				},
			},
			update: {
				type,
				question: questionText,
				imageUrl,
				createdAt,
				multipleChoiceQuestion: {
					upsert: {
						create: {
							answers: {
								createMany: {
									data: answers.map((answer) => ({
										answer: answer.answer,
										isCorrect: answer.isCorrect,
										createdAt: answer.createdAt,
									})),
								},
							},
						},
						update: {
							answers: {
								upsert: answers.map((answer) => ({
									where: { id: answer.id || "" },
									create: {
										answer: answer.answer,
										isCorrect: answer.isCorrect,
										createdAt: answer.createdAt,
									},
									update: {
										answer: answer.answer,
										isCorrect: answer.isCorrect,
										createdAt: answer.createdAt,
									},
								})),
							},
						},
					},
				},
			},
		});
	} else if (question.type === "CODE") {
		const {
			id,
			type,
			question: questionText,
			imageUrl,
			createdAt,
			description,
			correctCode,
		} = question as CodeQuestionType;

		return prisma.question.upsert({
			where: { id },
			create: {
				type,
				question: questionText,
				imageUrl,
				createdAt,
				codeQuestion: {
					create: {
						correctCode,
					},
				},
			},
			update: {
				type,
				question: questionText,
				imageUrl,
				createdAt,
				codeQuestion: {
					upsert: {
						create: {
							correctCode,
						},
						update: {
							correctCode,
						},
					},
				},
			},
		});
	} else {
		throw new Error(`Unrecognized question type: ${question.type}`);
	}
}

export default TestController;
