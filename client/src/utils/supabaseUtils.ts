import { createClient } from "@supabase/supabase-js";
import { TestType } from "../../../shared/models";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadFileToBucket(bucketName: string, file: File) {
	const timestamp = new Date().getTime();
	const fileName = `${timestamp}_${file.name.replace(" ", "_")}`;
	const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file);

	if (error) {
		console.error("Error uploading file:", error.message);
		return undefined;
	}

	return data.path;
}

export async function removeFileFromBucket(bucketName: string, path: string) {
	try {
		const { error } = await supabase.storage.from(bucketName).remove([path]);
		if (error) {
			console.error("Error removing file:", error.message);
			throw new Error("Error removing file from bucket");
		}
	} catch (err) {
		throw err;
	}
}

export async function removeAllTestImagesFromBucket(test: TestType) {
	let filePaths: string[] = [];

	test.questions.map((question) => {
		if (question.imageUrl) {
			filePaths.push(question.imageUrl);
		}
	});

	const { error } = await supabase.storage.from("questionImages").remove(filePaths);

	if (error) {
		console.log("Error removing all test images from bucket: ", error.message);
	}
}
