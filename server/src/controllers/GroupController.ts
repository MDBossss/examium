import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { MemberType, MessageType, StudyGroupType } from "../../../shared/models";
import { io } from "../utils/socket";
import { removeFilesFromBucket } from "../utils/supabase";

class GroupController {
	private async getStudyGroupMemberCount(studyGroupId: string) {
		const count = await prisma.member.count({
			where: {
				studyGroupId,
			},
		});
		return count;
	}

	/** Function has to be arrow function due to the way "this" works in js
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
	 * otherwise, "this.foo()" references the function itself not the class
	 */
	getPublicStudyGroups = async (req: Request, res: Response) => {
		try {
			const studyGroups = await prisma.studyGroup.findMany({
				where: { isPublic: true },
				include: {
					owner: true,
				},
			});
			if (!studyGroups || studyGroups.length === 0) {
				return res.status(200).json([]);
			}

			//Iterate and fetch member count  for each group
			const formattedGroups: StudyGroupType[] = await Promise.all(
				studyGroups.map(async (group) => {
					return {
						id: group.id,
						name: group.name,
						description: group.description,
						isPublic: group.isPublic,
						imageUrl: group.imageUrl,
						memberCount: await this.getStudyGroupMemberCount(group.id),
						owner: group.owner,
					} as StudyGroupType;
				})
			);

			return res.status(200).json(formattedGroups);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	};

	getStudyGroupById = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const {userId} = req.query;

			const member = await prisma.member.findFirst({
				where:{
					userId: userId as string,
					studyGroupId: id
				}
			})

			if(!member){
				return res.status(403).json({error: "You are not member of this group"})
			}

			const studyGroup = await prisma.studyGroup.findUnique({
				where: {
					id,
				},
				include: {
					members: {
						include: {
							user: true,
						},
					},
					messages: true,
					owner: true,
				},
			});

			if (!studyGroup) {
				return res.status(200).json(null);
			}

			//Iterate and fetch member count  for each group
			const formattedGroup: StudyGroupType = {
				id: studyGroup.id,
				name: studyGroup.name,
				description: studyGroup.description,
				imageUrl: studyGroup.imageUrl,
				isPublic: studyGroup.isPublic,
				ownerId: studyGroup.ownerId,
				owner: studyGroup.owner,
				messages: studyGroup.messages as MessageType[],
				members: studyGroup.members,
				memberCount: await this.getStudyGroupMemberCount(studyGroup.id),
			};
			return res.status(200).json(formattedGroup);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	};

	getUserStudyGroups = async (req: Request, res: Response) => {
		try {
			const { userId } = req.params;
			const studyGroups = await prisma.studyGroup.findMany({
				where: {
					members: {
						some: {
							userId,
						},
					},
				},
				include: {
					owner: true,
				},
			});

			//Iterate and fetch member count  for each group
			const formattedGroups: StudyGroupType[] = await Promise.all(
				studyGroups.map(async (group) => {
					return {
						id: group.id,
						name: group.name,
						description: group.description,
						isPublic: group.isPublic,
						imageUrl: group.imageUrl,
						memberCount: await this.getStudyGroupMemberCount(group.id),
						owner: group.owner,
					} as StudyGroupType;
				})
			);

			return res.status(200).json(formattedGroups);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	};

	async createStudyGroup(req: Request, res: Response) {
		try {
			const studyGroup = req.body;

			const newStudyGroup = await prisma.$transaction([
				prisma.studyGroup.create({
					data: {
						id: studyGroup.id,
						name: studyGroup.name,
						description: studyGroup.description,
						isPublic: studyGroup.isPublic,
						imageUrl: studyGroup.imageUrl,
						owner: {
							connect: {
								id: studyGroup.ownerId,
							},
						},
					},
				}),

				prisma.member.create({
					data: {
						userId: studyGroup.ownerId,
						studyGroupId: studyGroup.id,
					},
				}),
			]);

			res.status(201).json(newStudyGroup);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async joinStudyGroup(req: Request, res: Response) {
		try {
			const { studyGroupId } = req.params;
			const { userId } = req.query;

			if (!userId?.toString()) {
				res.status(404).json({ error: "User ID not found" });
			}

			const member = await prisma.member.findFirst({
				where: {
					userId: userId?.toString(),
					studyGroupId: studyGroupId,
				},
			});

			if (member) {
				res.status(200).json({ message: "You are already a member of this group!" });
				return;
			}

			const newMember = await prisma.member.create({
				data: {
					userId: userId?.toString()!,
					studyGroupId: studyGroupId,
				},
				include: {
					user: true,
				},
			});

			await prisma.studyGroup.update({
				where: {
					id: studyGroupId,
				},
				data: {
					members: {
						connect: {
							id: newMember.id,
						},
					},
				},
			});

			const memberJoinKey = `chat:${studyGroupId}:member:join`;
			io.emit(memberJoinKey, newMember as MemberType);

			res.status(201).json({ newMember });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async leaveStudyGroup(req: Request, res: Response) {
		try {
			const { studyGroupId } = req.params;
			const { userId } = req.query;

			if (!userId) {
				res.status(404).json({ error: "User ID not found" });
			}

			const member = await prisma.member.findFirst({
				where: {
					userId: userId as string,
					studyGroupId: studyGroupId,
				},
				include:{
					user:true
				}
			});

			if (!member) {
				res.status(404).json({ error: "No such member found" });
			}

			await prisma.message.updateMany({
				where: { memberId: member?.id },
				data: {
					memberId: null,
				},
			});

			await prisma.member.delete({
				where: {
					id: member?.id,
				},
			});

			const memberLeaveKey = `chat:${studyGroupId}:member:leave`;
			io.emit(memberLeaveKey, member as MemberType);

			res.status(200).json({ message: "Removed member from group." });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async updateStudyGroup(req: Request, res: Response) {
		try {
			const studyGroup: StudyGroupType = req.body;

			const updatedStudyGroup = await prisma.studyGroup.update({
				where: {
					id: studyGroup.id,
				},
				data: {
					name: studyGroup.name,
					description: studyGroup.description,
					imageUrl: studyGroup.imageUrl,
					isPublic: studyGroup.isPublic,
				},
			});
			res.status(200).json(updatedStudyGroup);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async deleteStudyGroup(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const group = await prisma.studyGroup.findUnique({
				where:{id},
				include:{
					messages:{
						where:{
							NOT: {
								fileUrl: null,
							},
						}
					}
				}
			})

			if(!group){
				return res.status(404).json({error: "Group not found"})
			}

			const allFileUrls: string[] = [group.imageUrl];
			if(group.messages){
				group.messages.map((message) => {
					if(message.fileUrl){
						allFileUrls.push(message.fileUrl)
					}
				})
				await removeFilesFromBucket("questionImages",allFileUrls);
			}

			await prisma.studyGroup.delete({
				where: { id },
			});
			res.status(204).json({ message: "Group deleted successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
}

export default GroupController;
