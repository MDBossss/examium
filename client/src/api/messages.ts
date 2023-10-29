import axios from "axios";
import { MessageType } from "../../../shared/models";

export async function createMessage(message:MessageType,userId:string){
    try{
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/messages`,{message,userId});
        return response.data
    }catch(error){
        throw new Error("Failed to create message!");
    }
}

export async function fetchMessages(pageParam: any | undefined = undefined,studyGroupId:string){
    try{
        const response = await  axios.get(`${import.meta.env.VITE_API_BASE_URL}/messages?pageParam=${pageParam}&studyGroupId=${studyGroupId}`);
        console.log(response.data)
        return response.data
    }catch(error){
        throw new Error("Failed to fetch messages!");
    }
}