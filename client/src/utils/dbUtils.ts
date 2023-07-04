import axios from "axios";
import { UserType } from "../types/models";

export async function fetchUsers() {
	try {
		const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users`);
		return response.data;
	} catch (error) {
		throw new Error("Failed to fetch new users");
	}
}

export async function fetchUserById(userId: string) {
	try {
		const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`);
		return response.data;
	} catch (error) {
		throw new Error("Failed to fetch user.");
	}
}

export async function createUser(user: UserType) {
	try {
		const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users`, user);
		return response.data;
	} catch (error) {
		throw new Error("Failed to create user");
	}
}

export async function updateUser(user:UserType){
    try{
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/${user.id}`,user);
        return response.data;
    }catch(error){
        throw new Error("Failed to update user");
    }
}

export async function deleteUser(userId:string){
    try{
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`);
        return response.data;
    }catch(error){
        throw new Error("Failed to delete user");
    }
}
