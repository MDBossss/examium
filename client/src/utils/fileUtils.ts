const imageExtensions = ["png", "jpg"];
const documentExtensions = ["pdf","docx","doc","xls","xlsx"];

export function getFileType(fileUrl:string): "image" | "document" | "unknown"{
    const extension = fileUrl.split(".").pop();
    if(extension){
        if(imageExtensions.includes(extension)){
            return "image";
        }
        else if(documentExtensions.includes(extension)){
            return "document";
        }
        else{
            return "unknown";
        }
    }
    else{
        return "unknown";
    }
}

export function getFullFileUrl(fileUrl:string){
    return `${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${fileUrl}`;
}