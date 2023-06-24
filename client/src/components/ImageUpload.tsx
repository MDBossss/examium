import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { Button } from "./ui/button";
import { TrashIcon } from "@heroicons/react/24/solid";

interface Props {
  onSetQuestionImage: (imageUrl: string | undefined, questionIndex:number) => void;
  imageUrl: string | undefined;
  questionIndex: number
}

const ImageUpload = ({ onSetQuestionImage, imageUrl,questionIndex }: Props) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    //upload image to supabase and get url
    const newImageUrl = "url from supabase";
    onSetQuestionImage(newImageUrl,questionIndex);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDeleteImage = () => {
    //delete image in supabase storage and set imageUrl to null
    onSetQuestionImage(undefined,questionIndex);
  };

  return (
    <div
      {...getRootProps()}
      className="w-full h-[200px] p-3 border-2 border-dashed border-slate-400 flex items-center justify-center rounded-sm relative"
    >
      {imageUrl ? (
        <>
          <img src={imageUrl} alt="image" className=" h-full object-cover" />
          <Button
            className="bg-red-500 hover:bg-red-600 p-3 text-white absolute right-1 top-1"
            onClick={handleDeleteImage}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </>
      )}
    </div>
  );
};

export default ImageUpload;
