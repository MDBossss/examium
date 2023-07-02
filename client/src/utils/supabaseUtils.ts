import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadImageToBucket(bucketName: string, file: File) {
	const timestamp = new Date().getTime();
	const fileName = `${timestamp}_${file.name}`;
	const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file);

	if (error) {
		console.error("Error uploading image:", error.message);
		return undefined;
	}

	return data.path;
}

export async function removeImageFromBucket(bucketName: string, path: string) {
	const { error } = await supabase.storage.from(bucketName).remove([path]);

	if (error) {
		console.error("Error removing image:", error.message);
	}

}