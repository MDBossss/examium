import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { StudyGroupType } from "../../../shared/models";

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
				messages: studyGroup.messages,
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

	async updateStudyGroup(req:Request,res:Response){
		try{
			const studyGroup:StudyGroupType = req.body;

			const updatedStudyGroup = await prisma.studyGroup.update({
				where:{
					id: studyGroup.id
				},
				data:{
					name: studyGroup.name,
					description: studyGroup.description,
					imageUrl: studyGroup.imageUrl,
					isPublic: studyGroup.isPublic,
				}
			})
			res.status(200).json(updatedStudyGroup)
		}catch(error){
			console.error(error);
			res.status(500).json({error:"Internal Server Error"})
		}
	}

	async deleteStudyGroup(req:Request,res:Response){
		try{
			const {id} = req.params;
			await prisma.studyGroup.delete({
				where: {id},
				include:{
					members: true,
					messages: true
				}
			})
			res.status(204).json({message: "Group deleted successfully"})
		}catch(error){
			console.error(error);
			res.status(500).json({error:"Internal Server Error"});
		}
	}
}

export default GroupController;
