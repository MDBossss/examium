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
					memberId:member.id,
                    testId:message.testId,
                    studyGroupId:message.studyGroupId!
				},
			});
			res.status(201).json(newMessage);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
}

export default MessageController;
