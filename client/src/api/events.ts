import axios from "axios";
import { EventType } from "../../../shared/models";
import { generateRepeatingEvents } from "../utils/dateUtils";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";

export async function createEvent(event: EventType, userId: string) {
	try {
		const response = await axios.post(
			`${import.meta.env.VITE_API_BASE_URL}/api/events/${userId}`,
			event
		);
		return response.data;
	} catch (error) {
		throw new Error("Failed to create event!");
	}
}

export async function updateEvent(event: EventType, userId: string) {
	try {
		const response = await axios.put(
			`${import.meta.env.VITE_API_BASE_URL}/api/events/${userId}`,
			event
		);
		return response.data;
	} catch (error) {
		throw new Error("Failed to update event!");
	}
}

export async function fetchUserEvents(userId: string) {
	try {
		const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/events/${userId}`);
        // Dates are not in right format
		let tempEvents: EventType[] = [];
		(response.data as EventType[]).map((e) => {
			tempEvents.push({ ...e, start: new Date(e.start), end: new Date(e.end) });
		});
        // Have to generate the repeat patterns before returning
        let generatedEvents: ProcessedEvent[] = [];
        tempEvents.map((e) => {
            generatedEvents.push(...generateRepeatingEvents(e))
        })

		return generatedEvents;
	} catch (error) {
		throw new Error("Failed to get user events!");
	}
}

export async function fetchTodayUserEvents(userId: string){
	try{
		const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/events/${userId}/today`);
		// Dates are not in right format
		let tempEvents: EventType[] = [];
		(response.data as EventType[]).map((e) => {
			tempEvents.push({ ...e, start: new Date(e.start), end: new Date(e.end) });
		});
		return response.data as EventType[]
	}catch(error){
		throw new Error("Failed to get todays user events!");
	}
}

export async function deleteEvent(event_id: string) {
	try {
		const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/events/${event_id}`);
		return response.data;
	} catch (error) {
		throw new Error("Failed to delete event!");
	}
}
