import axios from "axios";
import { MessageType } from "../../../shared/models";

export async function createMessage(message:MessageType,userId:string){
    try{
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/messages`,{message,userId});
        return response.data
    }catch(error){
        throw new Error("Failed to create message!");
    }
}

export async function fetchMessages(pageParam: any | undefined = undefined,studyGroupId:string){
    try{
        let queryParams = "?";
        if(pageParam){
            queryParams = queryParams.concat(`pageParam=${pageParam}&`)
        }
        if(studyGroupId){
            queryParams = queryParams.concat(`studyGroupId=${studyGroupId}`)
        }
        const response = await  axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/messages${queryParams}`);
        return response.data
    }catch(error){
        throw new Error("Failed to fetch messages!");
    }
}

export async function deleteMessage(id:string){
    try{
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/messages/${id}`);
        return response.data;
    }catch(error){
        throw new Error("Failed to delete message!");
    }
}