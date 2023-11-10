import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { MessageType } from "../../../shared/models";
import { removeFileFromBucket } from "../utils/supabase";
import { io } from "../utils/socket";

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
				include: {
					member: {
						include: {
							user: true,
						},
					},
					test: true,
				},
			});

			const channelKey = `chat:${message.studyGroupId}:messages`;
			io.emit(channelKey, newMessage as MessageType);

			res.status(201).json(newMessage);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async fetchMessages(req: Request, res: Response) {
		const MESSAGE_BATCH = 10;
		try {
			const { pageParam, studyGroupId } = req.query;
			let messages: MessageType[] = [];

			if (pageParam) {
				messages = await prisma.message.findMany({
					take: MESSAGE_BATCH,
					skip: 1,
					cursor: {
						id: pageParam.toString(),
					},
					where: {
						studyGroupId: studyGroupId?.toString(),
					},
					include: {
						member: {
							include: {
								user: true,
							},
						},
						test: {
							include: {
								questions: true,
							},
						},
					},
					orderBy: {
						createdAt: "desc",
					},
				}) as MessageType[];
			} else {
				messages = await prisma.message.findMany({
					take: MESSAGE_BATCH,
					where: {
						studyGroupId: studyGroupId?.toString(),
					},
					include: {
						member: {
							include: {
								user: true,
							},
						},
						test: {
							include: {
								questions: true,
							},
						},
					},
					orderBy: {
						createdAt: "desc",
					},
				}) as MessageType[];
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

	async fetchMessagesWithFiles(req: Request, res: Response) {
		const MESSAGE_BATCH = 30;
		try {
			const { pageParam, studyGroupId } = req.query;
			let messages: MessageType[] = [];

			if (pageParam) {
				messages = await prisma.message.findMany({
					take: MESSAGE_BATCH,
					skip: 1,
					cursor: {
						id: pageParam.toString(),
					},
					where: {
						NOT: {
							fileUrl: null,
						},
						studyGroupId:studyGroupId as string,
						deleted:false
					},
					include: {
						member: {
							include: {
								user: true,
							},
						},
					},
					orderBy: {
						createdAt: "desc",
					},
				}) as MessageType[];
			} else {
				messages = await prisma.message.findMany({
					take: MESSAGE_BATCH,
					where: {
						NOT: {
							fileUrl: null,
						},
						studyGroupId:studyGroupId as string,
						deleted:false
					},
					include: {
						member: {
							include: {
								user: true,
							},
						},
					},
					orderBy: {
						createdAt: "desc",
					},
				}) as MessageType[];
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

	async deleteMessage(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const prevMessage = await prisma.message.findFirst({
				where: { id },
			});

			const newMessage = await prisma.message.update({
				where: { id },
				data: {
					content: "Message deleted",
					deleted: true,
					fileUrl: "",
					testId: null,
				},
				include: {
					member: {
						include: {
							user: true,
						},
					},
				},
			});
			if (prevMessage?.fileUrl) {
				await removeFileFromBucket("questionImages", prevMessage?.fileUrl);
			}

			const updateKey = `chat:${newMessage.studyGroupId}:messages:update`;
			io.emit(updateKey, newMessage as MessageType);

			res.status(204).json(newMessage);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
}

export default MessageController;
