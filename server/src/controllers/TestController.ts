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

	async getTestsByUserId(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const tests = await prisma.test.findMany({
				where: {
					authorId: id,
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
					collaborators : true
				},
			});
			if (!test) {
				res.status(404).json({ error: "Test not found" });
				return;
			}
			res.json(test);
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
				collaborators,
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
					...(collaborators && {collaborators: {
						connect: collaborators?.map((collaborator) => ({
							email_testId: {
								email: collaborator,
								testId: id
							}
						}))
					}
					})
				},
				include: {
					author: true,
					questions: true,
					collaborators: true
				},
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
				collaborators,
				authorId,
			}: TestType = req.body;

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
						update: questions.map((question) => ({
							where: { id: question.id },
							data: {
								question: question.question,
								imageUrl: question.imageUrl,
								answers: {
									update: question.answers.map((answer) => ({
										where: { id: answer.id },
										data: {
											answer: answer.answer,
											isCorrect: answer.isCorrect,
										},
									})),
								},
							},
						})),
					},
					collaborators: {
						connect: collaborators?.map((collaborator) => ({
							email_testId: {
								email: collaborator,
								testId: id
							}
						}))
					}
				},
				include: {
					author: true,
					questions: {
						include: {
							answers: true,
						},
					},
					collaborators: true
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
					collaborators: true
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
