import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { EventType, OptionType, TestType } from "../../../shared/models";
import { endOfDay, startOfDay } from "date-fns";
import { generateRepeatingEvents } from "../utils/dateUtils";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";

class EventController {
	async getUserEvents(req: Request, res: Response) {
		try {
			const { userId } = req.params;
			const events = await prisma.event.findMany({
				where: { userId },
				include: {
					selectedTests: true,
				},
				orderBy:{
					start: "asc"
				}
			});
			if (!events || events.length === 0) {
				return res.status(200).json([]);
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
					location: event.location,
					start: event.start,
					end: event.end,
					allDay: event.allDay,
					color: event.color,
					repeatPattern: event.repeatPattern,
					testOptions: formattedTests,
				};
				formattedEvents.push(tempEvent);
			});

			res.status(200).json(formattedEvents);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async getTodayUserEventsWithTests(req: Request, res: Response) {
		const today = new Date();
		const currentDay = today.getDay()
		const startOfDayDate = startOfDay(today);
		const endOfDayDate = endOfDay(today);

		try {
			const { userId } = req.params;
			const events = await prisma.event.findMany({
				where: { userId},
				include: {
					selectedTests: {
						include: {
							questions: true
						}
					}
				},
				orderBy:{
					start: "asc"
				}
			});
			if (!events || events.length === 0) {
				return res.status(200).json([]);
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
					location: event.location,
					start: event.start,
					end: event.end,
					allDay: event.allDay,
					color: event.color,
					repeatPattern: event.repeatPattern,
					testOptions: formattedTests,
					selectedTests: event.selectedTests as TestType[],
				};
				formattedEvents.push(tempEvent);
			});

			const todayEvents = formattedEvents
				.filter((event) => new Date(event.start).getDay() === currentDay)
				.flatMap((event) => generateRepeatingEvents(event))
				.filter((event) => isAfter(new Date(event.start),startOfDayDate) && isBefore(new Date(event.start),endOfDayDate))

			res.status(200).json(todayEvents);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Errror" });
		}
	}

	async createEvent(req: Request, res: Response) {
		try {
			const { userId } = req.params;
			const event: EventType = req.body;

			let {
				event_id,
				title,
				description,
				start,
				end,
				color,
				allDay,
				repeatPattern,
				testOptions,
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
						connect: testOptions.map((test) => ({ id: test.value })),
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
				testOptions,
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
						connect: testOptions.map((test) => ({ id: test.value })),
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
