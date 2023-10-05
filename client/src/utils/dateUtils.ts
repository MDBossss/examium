import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import {
	addDays,
	addMonths,
	addWeeks,
	getMonth,
	getWeek,
	getYear,
	isBefore,
	setHours,
	setMinutes,
} from "date-fns";

export function getTimeAgo(timestamp: Date) {
	const currentDate = new Date();
	const previousDate = new Date(timestamp);
	const timeDifference = currentDate.getTime() - previousDate.getTime();
	const seconds = Math.floor(timeDifference / 1000);

	if (seconds < 60) {
		return `${seconds} seconds ago`;
	}

	const minutes = Math.floor(seconds / 60);

	if (minutes < 60) {
		return `${minutes} minutes ago`;
	}

	const hours = Math.floor(minutes / 60);

	if (hours < 24) {
		return `${hours} hours ago`;
	}

	const days = Math.floor(hours / 24);
	return `${days} days ago`;
}

interface EditorInput {
	event_id: string | number;
	title: string;
	description: string;
	start: Date | string;
	end: Date | string;
	allDay: boolean | undefined;
	color: string;
	repeatPattern: "none" | "daily" | "weekly" | "monthly";
}

export function generateRepeatingEvents(event: EditorInput): ProcessedEvent[] {
	const { start, end, repeatPattern } = event;
	const occurrences: EditorInput[] = [];
	let currentDate = new Date(start);

	switch (repeatPattern) {
		case "none":
			occurrences.push(event);
			return occurrences as ProcessedEvent[];

		case "daily":
			//Skips occurrences already passed
			while (getWeek(currentDate, { weekStartsOn: 1 }) < getWeek(new Date(), { weekStartsOn: 1 })) {
				currentDate = addDays(currentDate, 1);
			}

			while (isBefore(currentDate, addDays(new Date(start), 14))) {
				occurrences.push({
					...event,
					start: new Date(currentDate),
					end: new Date(
						setHours(setMinutes(currentDate, new Date(end).getMinutes()), new Date(end).getHours())
					),
				});
				currentDate = addDays(currentDate, 1);
			}
			return occurrences as ProcessedEvent[];

		case "weekly":
			//Skips occurrences already passed
			while (getMonth(currentDate) < getMonth(new Date())) {
				currentDate = addWeeks(currentDate, 1);
			}

			while (isBefore(currentDate, addWeeks(new Date(start), 14))) {
				occurrences.push({
					...event,
					start: new Date(currentDate),
					end: new Date(
						setHours(setMinutes(currentDate, new Date(end).getMinutes()), new Date(end).getHours())
					),
				});
				currentDate = addWeeks(currentDate, 1);
			}
			console.log(occurrences);
			return occurrences as ProcessedEvent[];

		case "monthly":
			//Skips occurrences already passed
			while (getYear(currentDate) < getYear(new Date())) {
				currentDate = addMonths(currentDate, 1);
			}

			while (isBefore(currentDate, addMonths(new Date(start), 14))) {
				occurrences.push({
					...event,
					start: new Date(currentDate),
					end: new Date(
						setHours(setMinutes(currentDate, new Date(end).getMinutes()), new Date(end).getHours())
					),
				});
				currentDate = addMonths(currentDate, 1);
			}
			console.log(occurrences);
			return occurrences as ProcessedEvent[];

		default:
			occurrences.push(event);
			return occurrences as ProcessedEvent[];
	}
}
