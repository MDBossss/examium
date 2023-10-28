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