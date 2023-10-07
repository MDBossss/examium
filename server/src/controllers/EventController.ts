import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { EventType, OptionType } from "../types/models";

class EventController {
	async getUserEvents(req: Request, res: Response) {
		try {
			const { userId } = req.params;
			const events = await prisma.event.findMany({
				where: { userId },
				include: {
					selectedTests: true,
				},
			});
			if (!events) {
				return res.status(404).json({ error: "User has no events" });
			}

			let formattedEvents: EventType[] = [];

			events.map((event) => {
				let formattedTests: OptionType[] = [];

				event.selectedTests.map((test) => {
					formattedTests.push({ label: test.title, value: test.id });
				});

				let tempEvent: EventType = {
					event_id: event.id,
					title: event.title,
					description: event.description || "",
					start: event.start,
					end: event.end,
					allDay: event.allDay,
					color: event.color,
					repeatPattern: event.repeatPattern as "none" | "daily" | "weekly" | "monthly",
					selectedTests: formattedTests,
				};
				formattedEvents.push(tempEvent);
			});

			res.status(200).json(formattedEvents);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async createEvent(req: Request, res: Response) {
		try {
			const { userId } = req.params;
			const event = req.body;

			let {
				event_id,
				title,
				description,
				start,
				end,
				color,
				allDay,
				repeatPattern,
				selectedTests,
			}: EventType = event;

			const newEvent = await prisma.event.create({
				data: {
					id: event_id.toString(),
					title,
					description,
					start,
					end,
					color,
					allDay: allDay || false,
					repeatPattern,
					selectedTests: {
						connect: selectedTests.map((test) => ({ id: test.value })),
					},
					userId,
				},
			});
			res.status(201).json(newEvent);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async updateEvent(req: Request, res: Response) {
		try {
			const { userId } = req.params;
			const event = req.body;
			let {
				event_id,
				title,
				description,
				start,
				end,
				color,
				allDay,
				repeatPattern,
				selectedTests,
			}: EventType = event;

			const updatedEvent = await prisma.event.update({
				where: { id: event_id.toString() },
				data: {
					id: event_id.toString(),
					title,
					description,
					start,
					end,
					color,
					allDay: allDay || false,
					repeatPattern,
					selectedTests: {
						connect: selectedTests.map((test) => ({ id: test.value })),
					},
					userId,
				},
			});
			res.status(200).json(updatedEvent);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async deleteEvent(req: Request, res: Response) {
		try {
			const { event_id } = req.params;
			await prisma.event.delete({ where: { id: event_id } });
			res.status(204).json({ message: "Event deleted successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
}

export default EventController;
