import addMonths from "date-fns/addMonths";
import {EventType} from "../../../shared/models";
import setMinutes from "date-fns/setMinutes";
import setHours from "date-fns/setHours";
import isBefore from "date-fns/isBefore";
import getYear from "date-fns/getYear";
import addWeeks from "date-fns/addWeeks";
import getMonth from "date-fns/getMonth";
import addDays from "date-fns/addDays";
import getWeek from "date-fns/getWeek";

/**
 * Function which generates repeating events based on the one passed
 * @param event One event from which repeating events will be generated based on the repeat pattern
 * @returns Array of events based on the repeating pattern of a single passed event
 */
export function generateRepeatingEvents(event: EventType): EventType[] {
	const { start, end, repeatPattern } = event;
	const occurrences: EventType[] = [];
	let currentDate = new Date(start);

	switch (repeatPattern) {
		case "NONE":
			occurrences.push(event);
			return occurrences;

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
			return occurrences;

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
			return occurrences;

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
			return occurrences ;

		default:
			occurrences.push(event);
			return occurrences ;
	}
}