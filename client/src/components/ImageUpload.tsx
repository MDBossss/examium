import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { Button } from "./ui/button";
import { Trash2Icon } from "lucide-react";
import { removeImageFromBucket, uploadImageToBucket } from "../utils/supabaseUtils";

interface Props {
  onSetQuestionImage: (imageUrl: string | undefined, questionIndex:number) => void;
  imageUrl: string | undefined;
  questionIndex: number
}

const ImageUpload = ({ onSetQuestionImage, imageUrl,questionIndex }: Props) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const path = await uploadImageToBucket("questionImages",acceptedFiles[0]);
    onSetQuestionImage(path,questionIndex);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDeleteImage = async () => {
    if(imageUrl){
      await removeImageFromBucket("questionImages",imageUrl)
      onSetQuestionImage(undefined,questionIndex);
    }
  };

  return (
    <div
      {...getRootProps()}
      className={`${isDragActive ? "border-blue-500" : "border-slate-400"} w-full h-[200px] p-3 border-2 border-dashed  flex items-center justify-center rounded-sm relative cursor-grab`}
    >
      {imageUrl ? (
        <>
          <img src={`${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${imageUrl}`} alt="image" className=" h-full object-cover" />
          <Button
            className="bg-red-500 hover:bg-red-600 p-3 text-white absolute right-1 top-1"
            onClick={handleDeleteImage}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500">Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </>
      )}
    </div>
  );
};

export default ImageUpload;
