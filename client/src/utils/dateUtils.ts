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
import { EventType } from "../../../shared/models";

/**
 * Function which returns the "ago" string based on the passed date and current time.
 * @param timestamp 
 * @returns times ago string
 */
export function getTimeAgo(timestamp: Date) {
	const currentDate = new Date();
	const previousDate = new Date(timestamp);
	const timeDifference = currentDate.getTime() - previousDate.getTime();
	const seconds = Math.floor(timeDifference / 1000);

	if(seconds < 30){
		return `Now`;
	}

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

/**
 * Function that uses regex expression to validate a time
 * @param inputTime time in a HH:mm value
 * @returns boolean value of the evaluation
 */
export const isValidTime = (inputTime: string) => {
	return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(inputTime);
}

/**
 * Function which generates repeating events based on the one passed
 * @param event One event from which repeating events will be generated based on the repeat pattern
 * @returns Array of events based on the repeating pattern of a single passed event
 */
export function generateRepeatingEvents(event: EventType): ProcessedEvent[] {
	const { start, end, repeatPattern } = event;
	const occurrences: EventType[] = [];
	let currentDate = new Date(start);

	switch (repeatPattern) {
		case "NONE":
			occurrences.push(event);
			return occurrences as ProcessedEvent[];

		case "DAILY":
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

		case "WEEKLY":
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
			return occurrences as ProcessedEvent[];

		case "MONTHLY":
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
