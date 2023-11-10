import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { Button } from "./ui/Button";
import { FileTextIcon, Trash2Icon } from "lucide-react";
import { removeFileFromBucket, uploadFileToBucket } from "../utils/supabaseUtils";
import Spinner from "./ui/Spinner";

interface Props {
	onSetFilePath: (path: string | undefined) => void;
	defaultFilePath?: string | undefined;
	fileType: "image" | "document"
}

const FileUpload = ({ onSetFilePath, defaultFilePath,fileType }: Props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [path, setPath] = useState<string | undefined>(defaultFilePath);

	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		setIsLoading(true);
		const path = await uploadFileToBucket(import.meta.env.VITE_SUPABASE_BUCKET_NAME, acceptedFiles[0]);
		setPath(path);
		onSetFilePath(path);
		setIsLoading(false);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const handleDeleteFile = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		if (path) {
			await removeFileFromBucket(import.meta.env.VITE_SUPABASE_BUCKET_NAME, path);
			setPath(undefined);
			onSetFilePath(undefined);
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
					{fileType === "image" ? <img
						src={`${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${path}`}
						alt="image"
						className="object-cover h-full"
					/> : <div className="flex flex-col items-center justify-center gap-5">
							<FileTextIcon className="w-10 h-10"/>
							<p className="text-xs truncate">{path.substring(14)}</p>
						</div>}
					
					<Button
						className="absolute p-3 text-white bg-red-500 hover:bg-red-600 right-1 top-1"
						onClick={(e) => handleDeleteFile(e)}
					>
						<Trash2Icon className="w-4 h-4" />
					</Button>
				</>
			) : (
				<>
					<input {...getInputProps()} id="image-upload" accept={fileType === "image" ? ".png, .jpg" : ".pdf, .docx, .doc, .xls, .xlsx"} />
					{isDragActive ? (
						<p className="text-blue-500">Drop the file here ...</p>
					) : isLoading ? (
						<Spinner />
					) : (
						<p className="text-center">Drag 'n' drop the file here, or click to select file (8MB max)</p>
					)}
				</>
			)}
		</div>
	);
};

export default FileUpload;
