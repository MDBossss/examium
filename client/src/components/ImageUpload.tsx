import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { Button } from "./ui/Button";
import { Trash2Icon } from "lucide-react";
import { removeImageFromBucket, uploadImageToBucket } from "../utils/supabaseUtils";
import Spinner from "./ui/Spinner";

interface Props {
	onSetQuestionImage: (imageUrl: string | undefined, questionID: string) => void;
	imageUrl: string | undefined;
	questionID: string
}

const ImageUpload = ({ onSetQuestionImage, imageUrl, questionID }: Props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		setIsLoading(true);
		const path = await uploadImageToBucket("questionImages", acceptedFiles[0]);
		onSetQuestionImage(path, questionID);
		setIsLoading(false);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const handleDeleteImage = async () => {
		if (imageUrl) {
			await removeImageFromBucket("questionImages", imageUrl);
			onSetQuestionImage(undefined, questionID);
		}
	};

	return (
		<div
			{...getRootProps()}
			className={`${
				isDragActive ? "border-blue-500" : "border-slate-400"
			} w-full h-[200px] p-3 border-2 border-dashed  flex items-center justify-center rounded-sm relative cursor-grab`}
		>
			{imageUrl ? (
				<>
					<img
						src={`${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${imageUrl}`}
						alt="image"
						className=" h-full object-cover"
					/>
					<Button
						className="bg-red-500 hover:bg-red-600 p-3 text-white absolute right-1 top-1"
						onClick={handleDeleteImage}
					>
						<Trash2Icon className="h-4 w-4" />
					</Button>
				</>
			) : (
				<>
					<input {...getInputProps()} accept=".png, .jpg" />
					{isDragActive ? (
						<p className="text-blue-500">Drop the files here ...</p>
					) : isLoading ? (
						<Spinner/>
					) : (
						<p>Drag 'n' drop .png files here, or click to select files</p>
					)}
				</>
			)}
		</div>
	);
};

export default ImageUpload;
