import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { UserType } from "../types/model";

class UserController {
	async getAllUsers(req: Request, res: Response) {
		try {
			const users = await prisma.user.findMany();
			res.json(users);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async getUserById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const user = await prisma.user.findUnique({ where: { id } });
			if (!user) {
				res.status(404).json({ error: "User not found" });
				return;
			}
			res.json(user);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async createUser(req: Request, res: Response) {
		try {
			const { ...userData }: UserType = req.body;
			const newUser = await prisma.user.create({
				data: { ...userData },
			});
			res.json(newUser);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async updateUser(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { ...userData }: UserType = req.body;
			const updatedUser = await prisma.user.update({
				where: { id },
				data: { ...userData },
			});
			res.json(updatedUser);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async deleteUser(req: Request, res: Response) {
		try {
			const { id } = req.params;
			await prisma.user.delete({ where: { id } });
			res.json({ message: "User deleted successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
}

export default UserController;
