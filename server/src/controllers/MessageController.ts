import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { MessageType } from "../../../shared/models";

class MessageController {
	async createMessage(req: Request, res: Response) {
		try {
			const { message, userId }: { message: MessageType; userId: string } = req.body;

			const member = await prisma.member.findFirst({
				where: {
					userId,
				},
			});

			if (!member) {
				return res.status(404).json({ error: "Member not found for the given userId" });
			}

			const newMessage = await prisma.message.create({
				data: {
					id: message.id,
					content: message.content,
					fileUrl: message.fileUrl,
					deleted: message.deleted,
					memberId: member.id,
					testId: message.testId,
					studyGroupId: message.studyGroupId!,
				},
			});
			res.status(201).json(newMessage);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async fetchMessages(req: Request, res: Response) {
		const MESSAGE_BATCH = 10;
		try {
			const { pageParam, studyGroupId } = req.params;

			let messages: MessageType[] = [];

			if (pageParam) {
				messages = await prisma.message.findMany({
					take: MESSAGE_BATCH,
					skip: 1,
					cursor: {
						id: pageParam,
					},
					where: {
						studyGroupId: studyGroupId,
					},
					include: {
						member: {
							include: {
								user: true,
							},
						},
						test: {
							include:{
								questions : true
							}
						}
					},
					orderBy: {
						createdAt: "desc",
					},
				});
			} else {
				messages = await prisma.message.findMany({
					take: MESSAGE_BATCH,
					where: {
						studyGroupId: studyGroupId,
					},
					include: {
						member: {
							include: {
								user: true,
							},
						},
						test: {
							include:{
								questions : true
							}
						}
					},
					orderBy: {
						createdAt: "desc",
					},
				});
			}

			let nextCursor = null;

			if (messages.length === MESSAGE_BATCH) {
				nextCursor = messages[MESSAGE_BATCH - 1].id;
			}

			return res.status(200).json({ messages, nextCursor });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
}

export default MessageController;
