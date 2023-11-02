import axios from "axios";
import { TestType } from "../../../shared/models";
import { removeAllTestImagesFromBucket } from "../utils/supabaseUtils";

export async function createTest(test: TestType) {
	try {
		const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/tests`, test);
		return response.data;
	} catch (error) {
		throw new Error("Failed to create test");
	}
}

export async function updateTest(test: TestType) {
	try {
		const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/tests/${test.id}`, test);
		return response.data;
	} catch (error) {
		throw new Error("Failed to update test");
	}
}

export async function fetchTests() {
	try {
		const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tests`);
		return response.data as TestType[];
	} catch (error) {
		throw new Error("Failed to fetch tests");
	}
}

export async function fetchTestsByUserId(authorId: string) {
	try {
		const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tests/user/${authorId}`);
		return response.data as TestType[];
	} catch (error) {
		throw new Error("Failed to fetch user tests");
	}
}

export async function fetchTestById(testId: string) {
	try {
		const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tests/${testId}`);
		return response.data as TestType;
	} catch (error) {
		throw new Error("Failed to fetch test");
	}
}

export async function fetchCollaborationTestsByUserId(userId: string) {
	try {
		const response = await axios.get(
			`${import.meta.env.VITE_API_BASE_URL}/api/tests/collaborations/${userId}`
		);
		return response.data as TestType[];
	} catch (error) {
		throw new Error("Failed to fetch user collaborations");
	}
}

export async function deleteTest(test: TestType) {
	try {
		const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/tests/${test.id}`);
		removeAllTestImagesFromBucket(test);
		return response.data;
	} catch (error) {
		throw new Error("Failed to delete test");
	}
}

export async function checkCode(task:string,firstCode: string, secondCode: string) {
	const code = { task, firstCode, secondCode };
	try {
		const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/code`, code);
		return response.data as {isCorrect: boolean, description: string | undefined};
	} catch (error) {
		throw new Error("Failed to check code.");
	}
}