import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { LocationType, UserType } from "../../../shared/models";

class UserController {
	async getAllUsers(req: Request, res: Response) {
		try {
			const users = await prisma.user.findMany();
			if (!users) {
				return res.status(404).json({ error: "No users found." });
			}
			res.status(200).json(users);
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
				return res.status(404).json({ error: "User not found" });
			}
			res.status(200).json(user);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async getUserByEmail(req: Request, res: Response) {
		try {
			const { email } = req.params;
			const user = await prisma.user.findUnique({ where: { email } });
			if (!user) {
				res.status(404).json({ error: "User not found" });
				return null;
			}
			res.status(200).json(user);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async createUser(req: Request, res: Response) {
		try {
			let { id, firstName, lastName, email, imageUrl }: UserType = req.body;
			if (!lastName) {
				lastName = "";
			}
			const newUser = await prisma.user.create({
				data: { id, firstName, lastName, email, imageUrl },
			});
			res.status(201).json(newUser);
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
			res.status(200).json(updatedUser);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async updateUserLocation(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { ...location }: LocationType = req.body;
			const updatedUser = await prisma.user.update({
				where: { id },
				data: {
					locationName: location.name,
					latitude: location.latitude,
					longitude: location.longitude,
				},
			});
			res.status(200).json(updatedUser);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async deleteUser(req: Request, res: Response) {
		try {
			const { id } = req.params;
			await prisma.user.delete({ where: { id } });
			res.status(204).json({ message: "User deleted successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async getBookmarkedTestsByUserId(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const user = await prisma.user.findUnique({
				where: {
					id,
				},
				include: {
					bookmarkedTests: {
						include: {
							author: true,
							collaborators: true,
						},
					},
				},
			});

			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}

			if (!user.bookmarkedTests || user.bookmarkedTests.length === 0) {
				return res.status(200).json([]);
			}

			res.status(200).json(user.bookmarkedTests);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async addBookmarkedTest(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { testId } = req.query;
			const user = await prisma.user.findUnique({
				where: {
					id,
				},
				include: {
					bookmarkedTests: true,
				},
			});

			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}

			if (user.bookmarkedTests.some((test) => test.id === testId)) {
				return res.status(200).json({ message: "Test already bookmarked" });
			}

			await prisma.user.update({
				where: {
					id,
				},
				data: {
					bookmarkedTests: {
						connect: {
							id: testId as string,
						},
					},
				},
			});

			res.status(200).json({ message: "Bookmarked added" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async removeBookmarkedTest(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { testId } = req.query;

			const user = await prisma.user.findUnique({
				where: {
					id,
				},
				include: {
					bookmarkedTests: true,
				},
			});

			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}

			if (!user.bookmarkedTests.some((test) => test.id === testId)) {
				return res.status(200).json({ message: "Test already bookmarked" });
			}

			await prisma.user.update({
				where: {
					id,
				},
				data: {
					bookmarkedTests: {
						disconnect: {
							id: testId as string,
						},
					},
				},
			});

			res.status(200).json({ message: "Bookmarked remove" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
}

export default UserController;
