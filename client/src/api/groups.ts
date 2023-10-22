import axios from "axios";
import { StudyGroupType } from "../../../shared/models";

export async function getPublicStudyGroups() {
	try {
		const response = await axios.get<StudyGroupType[]>(
			`${import.meta.env.VITE_API_BASE_URL}/groups/public`
		);
		return response.data;
	} catch (error) {
		throw new Error("Failed to get public groups!");
	}
}

export async function getStudyGroupById(id: string) {
	try {
		const response = await axios.get<StudyGroupType>(
			`${import.meta.env.VITE_API_BASE_URL}/groups/${id}`
		);
		return response.data;
	} catch (error) {
		throw new Error("Failed to get study group by id!");
	}
}

export async function getUserStudyGroups(userId: string) {
	try {
		const response = await axios.get<StudyGroupType[]>(
			`${import.meta.env.VITE_API_BASE_URL}/groups/user/${userId}`
		);
		return response.data;
	} catch (error) {
		throw new Error("Failed to get user groups!");
	}
}

export async function createStudyGroup(studyGroup: StudyGroupType) {
	try {
		const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/groups`, studyGroup);
		return response.data;
	} catch (error) {
		throw new Error("Failed to create study group!");
	}
}

export async function updateStudyGroup(studyGroup: StudyGroupType){
	try{
		const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/groups/${studyGroup.id}`,studyGroup);
		return response.data;
	}catch(error){
		throw new Error("Failed to update study group!");
	}
}

export async function deleteStudyGroup(id:string){
	try{
		const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/groups/${id}`);
		return response.data;
	}catch(error){
		throw new Error("Failed to delete study group!");
	}
}
