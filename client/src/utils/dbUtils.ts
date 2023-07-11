import { TestType, UserType } from "../types/models";
import axios from "axios";
import { removeAllTestImagesFromBucket } from "./supabaseUtils";

export async function fetchUsers() {
	try {
		const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users`);
		return response.data as UserType;
	} catch (error) {
		throw new Error("Failed to fetch new users");
	}
}

export async function fetchUserById(userId: string) {
	try {
		const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`);
		if (response.status === 200) {
			// User exists, return the data
			return response.data as UserType;
		} else if (response.status === 404) {
			// User not found, return null or throw an error
			return null; // Or throw new Error("User not found");
		} else {
			// Handle other status codes if needed
			return null;
		}
	} catch (error) {
		return null;
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

export async function updateUser(user: UserType) {
	try {
		const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/${user.id}`, user);
		return response.data;
	} catch (error) {
		throw new Error("Failed to update user");
	}
}

export async function deleteUser(userId: string) {
	try {
		const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`);
		return response.data;
	} catch (error) {
		throw new Error("Failed to delete user");
	}
}



export async function createTest(test: TestType) {
	try {
		const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/tests`, test);
		return response.data;
	} catch (error) {
		throw new Error("Failed to create test")
	}
}

export async function updateTest(test: TestType){
	try{
		const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/tests/${test.id}`,test);
		return response.data;
	}catch(error){
		throw new Error("Failed to update test")
	}
}

export async function fetchTests(){
	try{
		const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tests`);
		return response.data as TestType[];
	}catch(error){
		throw new Error("Failed to fetch tests")
	}
}

export async function fetchTestsByUserId(userId: string){
	try{
		const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tests/user/${userId}`);
		return response.data as TestType[];
	}catch(error){
		throw new Error("Failed to fetch user tests");
	}
}

export async function fetchTestById(testId: string){
	try{
		const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tests/${testId}`);
		return response.data as TestType;
	}catch(error){
		throw new Error("Failed to fetch test")
	}
}

export async function deleteTest(test: TestType){
	try{
		const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/tests/${test.id}`);
		removeAllTestImagesFromBucket(test);
		return response.data;
	}catch(error){
		throw new Error("Failed to  test")
	}
	
}