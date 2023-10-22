import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { Button } from "./ui/Button";
import { Trash2Icon } from "lucide-react";
import { removeImageFromBucket, uploadImageToBucket } from "../utils/supabaseUtils";
import Spinner from "./ui/Spinner";

interface Props {
	onSetImage: (path: string | undefined) => void;
	imageUrl?: string | undefined;
}

const ImageUpload = ({ onSetImage, imageUrl }: Props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [path, setPath] = useState<string | undefined>(imageUrl);

	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		setIsLoading(true);
		const path = await uploadImageToBucket(import.meta.env.VITE_SUPABASE_BUCKET_NAME, acceptedFiles[0]);
		setPath(path);
		onSetImage(path);
		setIsLoading(false);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const handleDeleteImage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		if (path) {
			await removeImageFromBucket(import.meta.env.VITE_SUPABASE_BUCKET_NAME, path);
			setPath(undefined);
			onSetImage(undefined);
		}
	};

	return (
		<div
			{...getRootProps()}
			className={`${
				isDragActive ? "border-blue-500" : "border-slate-400"
			} w-full h-[200px] p-3 border-2 border-dashed  flex items-center justify-center rounded-sm relative cursor-grab`}
		>
			{path ? (
				<>
					<img
						src={`${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${path}`}
						alt="image"
						className="object-cover h-full "
					/>
					<Button
						className="absolute p-3 text-white bg-red-500 hover:bg-red-600 right-1 top-1"
						onClick={(e) => handleDeleteImage(e)}
					>
						<Trash2Icon className="w-4 h-4" />
					</Button>
				</>
			) : (
				<>
					<input {...getInputProps()} id="image-upload" accept=".png, .jpg" />
					{isDragActive ? (
						<p className="text-blue-500">Drop the files here ...</p>
					) : isLoading ? (
						<Spinner />
					) : (
						<p className="text-center">Drag 'n' drop .png files here, or click to select files</p>
					)}
				</>
			)}
		</div>
	);
};

export default ImageUpload;
