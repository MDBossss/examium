import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

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