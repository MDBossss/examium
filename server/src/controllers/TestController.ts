import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { TestType } from "../types/model";

class TestController {
	async getAllTests(req: Request, res: Response) {
		try {
			const tests = await prisma.test.findMany();
			res.json(tests);
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
			res.json(tests);
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
			res.json(tests);
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
						include: {
							answers: true,
						},
					},
					collaborators: true,
					author: true,
				},
			});

			if (!test) {
				res.status(404).json({ error: "Test not found" });
				return;
			}

			const testWithCollaborators = {
				...test,
				collaboratorEmails: test.collaborators.map((collaborator) => collaborator.email),
			};

			res.json(testWithCollaborators);
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
						create: questions.map((question) => ({
							id: question.id,
							question: question.question,
							imageUrl: question.imageUrl,
							answers: {
								create: question.answers.map((answer) => ({
									id: answer.id,
									answer: answer.answer,
									isCorrect: answer.isCorrect,
								})),
							},
						})),
					},
					collaborators: {
						connect: collaboratorEmails?.map((email) => ({ email })),
					},
				},
				// include: {
				// 	author: true,
				// 	questions: true,
				// 	collaboratorEmails: true,
				// },
			});

			res.status(201).json(newTest);
		} catch (error) {
			console.error("Error creating test:", error);
			res.status(500).json({ error: "Failed to create test" });
		}
	}

	async updateUser(req: Request, res: Response) {
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

			//Delete outdated answers
			const outdatedAnswerIds = await prisma.answer.deleteMany({
				where: {
					question: {
						testId: id,
						NOT: {
							id: {
								in: questions.flatMap((question) =>
									question.answers.map((answer) => answer.id).filter(Boolean)
								),
							},
						},
					},
				},
			});

			// Delete outdated questions
			const outdatedQuestionIds = await prisma.question.deleteMany({
				where: {
					testId: id,
					NOT: {
						id: {
							in: questions.map((question) => question.id).filter(Boolean),
						},
					},
				},
			});

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
								question: question.question,
								imageUrl: question.imageUrl,
								answers: {
									createMany: {
										data: question.answers.map((answer) => ({
											answer: answer.answer,
											isCorrect: answer.isCorrect,
										})),
									},
								},
							},
							update: {
								question: question.question,
								imageUrl: question.imageUrl,
								answers: {
									upsert: question.answers.map((answer) => ({
										where: { id: answer.id },
										create: {
											answer: answer.answer,
											isCorrect: answer.isCorrect,
										},
										update: {
											answer: answer.answer,
											isCorrect: answer.isCorrect,
										},
									})),
								},
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
							answers: true,
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
			res.json({ message: "Test deleted successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
}

export default TestController;
