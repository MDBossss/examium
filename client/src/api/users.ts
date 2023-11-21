import axios from "axios";
import { LocationType, TestType, UserType } from "../../../shared/models";

export async function fetchUsers() {
	try {
		const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`);
		return response.data as UserType;
	} catch (error) {
		throw new Error("Failed to fetch new users");
	}
}

export async function fetchUserById(userId: string) {
	try {
		const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`);
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

export async function fetchUserByEmail(email: string) {
	try {
		const response = await axios.get(
			`${import.meta.env.VITE_API_BASE_URL}/api/users/email/${email}`
		);
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
		const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users`, user);
		return response.data;
	} catch (error) {
		throw new Error("Failed to create user");
	}
}

export async function updateUser(user: UserType) {
	try {
		const response = await axios.put(
			`${import.meta.env.VITE_API_BASE_URL}/api/users/${user.id}`,
			user
		);
		return response.data;
	} catch (error) {
		throw new Error("Failed to update user");
	}
}

export async function updateUserLocation(userId: string, location: LocationType) {
	try {
		const response = await axios.put(
			`${import.meta.env.VITE_API_BASE_URL}/api/users/location/${userId}`,
			location
		);
		return response.data;
	} catch (error) {
		throw new Error("Failed to update user location");
	}
}

export async function deleteUser(userId: string) {
	try {
		const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`);
		return response.data;
	} catch (error) {
		throw new Error("Failed to delete user");
	}
}

export async function fetchBookmarkedTestsByUserId(userId: string) {
	try {
		const response = await axios.get(
			`${import.meta.env.VITE_API_BASE_URL}/api/users/bookmarked/${userId}`
		);
		return response.data as TestType[];
	} catch (error) {
		throw new Error("Failed to fetch user bookmarked tests");
	}
}

export async function addBookmarkedTest(userId: string, testId: string) {
	try {
		const response = await axios.put(
			`${import.meta.env.VITE_API_BASE_URL}/api/users/bookmarked/${userId}?testId=${testId}`
		);
		return response.data;
	} catch (error) {
		throw new Error("Failed to add bookmarked test");
	}
}

export async function deleteBookmarkedTest(userId: string, testId: string) {
	try {
		const response = await axios.delete(
			`${import.meta.env.VITE_API_BASE_URL}/api/users/bookmarked/${userId}?testId=${testId}`
		);
		return response.data;
	} catch (error) {
		throw new Error("Failed ot remove bookmarked test");
	}
}
