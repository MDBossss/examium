import axios from "axios";
import { EventType } from "../types/models";


export async function createEvent(event:EventType,userId:string){
    try{
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/events/${userId}`,event);
        return response.data;
    }catch(error){
        throw new Error("Failed to create event!");
    }
}

export async function updateEvent(event: EventType, userId:string){
    try{
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/events/${userId}`,event);
        return response.data;
    }catch(error){
        throw new Error("Failed to update event!");
    }
}

export async function fetchUserEvents(userId:string){
    try{
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/events/${userId}`);
        return response.data as EventType[]
    }catch(error){
        throw new Error("Failed to get user events!");
    }
}

export async function deleteEvent(event_id: string){
    try{
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/events/${event_id}`)
        return response.data;
    }catch(error){
        throw new Error("Failed to delete event!");
    }
}