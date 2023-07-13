import { useRef } from "react"
import useClickOutside from "../../../hooks/useClickOutside";
import { UserProfile } from "@clerk/clerk-react";
import { XIcon } from "lucide-react";

interface Props{
    handleToggleProfile: (value:boolean) => void 
}

const ProfileDialog = ({handleToggleProfile}:Props) => {
    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, () => handleToggleProfile(false));

  return (
    <div className="absolute w-screen h-screen top-0 left-0 z-50 flex justify-center bg-white bg-opacity-50 backdrop-blur-sm  transition-all overflow-y-auto">
        <div ref={ref} className="absolute justify-center py-10 z-50 ">
            <XIcon className="w-6 h-6 absolute top-2 right-1/2 cursor-pointer hover:text-red-500" onClick={() => handleToggleProfile(false)}/>
            <UserProfile />
        </div>
    </div>
  )
}

export default ProfileDialog