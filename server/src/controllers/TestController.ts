import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { TestType } from "../types/models";

class TestController {
	async getAllTests(req: Request, res: Response) {
		try {
			const tests = await prisma.test.findMany();
			if(!tests || tests.length === 0){
				return res.status(404).json({error: "No tests found."})
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
			if(!tests || tests.length === 0){
				return res.status(404).json({error: "No tests found."})
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
			if(!tests || tests.length === 0){
				return res.status(404).json({error: "No tests found."})
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
							createdAt: "asc"
						},
						include: {
							answers: {
								orderBy : {
									createdAt: "asc"
								}
							}
						},
					},
					collaborators: true,
					author: true,
				},
			});

			if (!test) {
				return res.status(404).json({ error: "Test not found" });
			}

			const testWithCollaborators = {
				...test,
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
						create: questions.map((question) => ({
							id: question.id,
							question: question.question,
							imageUrl: question.imageUrl,
							createdAt: question.createdAt,
							answers: {
								create: question.answers.map((answer) => ({
									id: answer.id,
									answer: answer.answer,
									isCorrect: answer.isCorrect,
									createdAt: answer.createdAt,
								})),
							},
						})),
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
			await prisma.answer.deleteMany({
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
								createdAt: question.createdAt,
								answers: {
									createMany: {
										data: question.answers.map((answer) => ({
											answer: answer.answer,
											isCorrect: answer.isCorrect,
											createdAt: answer.createdAt
										})),
									},
								},
							},
							update: {
								question: question.question,
								imageUrl: question.imageUrl,
								createdAt: question.createdAt,
								answers: {
									upsert: question.answers.map((answer) => ({
										where: { id: answer.id },
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
			res.status(204).json({ message: "Test deleted successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
}

export default TestController;
