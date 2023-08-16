import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { AnswerType, CodeQuestionType, MultipleChoiceQuestionType, QuestionType, QuestionVariantsType, TestType } from "../types/models";

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
				return res.status(200).json([]);
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
				return res.status(200).json([]);
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

			//this is the object which contains all the data needed, but just needs to be formatted to the `TestType` typescript model
			const testWithCollaborators = {
				...testWithQuestions,
				collaboratorEmails: test.collaborators.map((collaborator) => collaborator.email),
			};
			
			// formatting the questions and the tests by the typescript model
			//because when fetching with prisma, the object structure obviously
			//is not the same, since im splitting the questions into multiple
			//tables, so here im creating the objects
			let formattedQuestions: QuestionType[] = [];
			testWithCollaborators.questions.map((question) => {
				if(question.type === "MULTIPLE_CHOICE"){
					let tempQuestion: MultipleChoiceQuestionType = {
						id: question.id,
						type: question.type,
						question: question.question,
						imageUrl: question.imageUrl as string | undefined,
						createdAt: question.createdAt,
						answers: question.multipleChoiceQuestion?.answers as AnswerType[]
					} 
					formattedQuestions.push(tempQuestion)
				}
				else if(question.type === "CODE"){
					let tempQuestion: CodeQuestionType = {
						id: question.id,
						type: question.type,
						question: question.question,
						imageUrl: question.imageUrl as string | undefined,
						createdAt: question.createdAt,
						description: question.codeQuestion?.description as string | undefined,
						correctCode: question.codeQuestion?.correctCode as string
					}
					formattedQuestions.push(tempQuestion)
				}
			})

			//formatting test
			const formattedTest: TestType = {
				id: testWithCollaborators.id,
				title: testWithCollaborators.title,
				description: testWithCollaborators.description,
				passCriteria: testWithCollaborators.passCriteria,
				showQuestionsOnResults: testWithCollaborators.showQuestionsOnResults,
				randomizeQuestions: testWithCollaborators.randomizeQuestions,
				randomizeAnswers: testWithCollaborators.randomizeAnswers,
				defaultQuestionType: testWithCollaborators.defaultQuestionType as QuestionVariantsType["type"],
				createdAt: testWithCollaborators.createdAt,
				updatedAt: testWithCollaborators.updatedAt,
				authorId: testWithCollaborators.authorId,
				author: testWithCollaborators.author,
				collaboratorEmails: testWithCollaborators.collaboratorEmails,
				collaborators: testWithCollaborators.collaborators,
				questions: formattedQuestions
			}


			res.status(200).json(formattedTest);
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
				defaultQuestionType,
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
					defaultQuestionType,
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
											// questionId: id,
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
											description
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
				defaultQuestionType,
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


			const updatedTest = await prisma.test.update({
				where: { id },
				data: {
					title,
					description,
					passCriteria,
					showQuestionsOnResults,
					randomizeQuestions,
					randomizeAnswers,
					defaultQuestionType,
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
									description: (question as CodeQuestionType).description
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
											description: (question as CodeQuestionType).description
										},
										update:{
											correctCode: (question as CodeQuestionType).correctCode,
											description: (question as CodeQuestionType).description
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
							multipleChoiceQuestion :{
								include :{
									answers: true
								}
							},
							codeQuestion: true
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
