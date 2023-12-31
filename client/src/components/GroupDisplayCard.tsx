import { UsersIcon } from "lucide-react";
import { StudyGroupType } from "../../../shared/models";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { joinStudyGroup } from "../api/groups";
import { useSession } from "@clerk/clerk-react";
import { useToast } from "../hooks/useToast";
import { useState } from "react";
import { Skeleton } from "./ui/Skeleton";

interface Props {
	studyGroup: StudyGroupType;
	isUserGroup: boolean;
	isJoined?: boolean | undefined;
	onGroupJoin?: () => void;
}

const GroupDisplayCard = ({ studyGroup, isUserGroup, isJoined, onGroupJoin }: Props) => {
	const { session } = useSession();
	const navigate = useNavigate();
	const { toast } = useToast();
	const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

	const handleClickCard = async () => {
		if (isJoined || isUserGroup) {
			navigate(`/groups/${studyGroup.id}`);
		} else {
			//join the group
			await joinStudyGroup(studyGroup.id, session?.user.id!)
				.then(() => {
					onGroupJoin ? onGroupJoin() : null;
					toast({
						title: "✅ Joined group successfully",
					});
				})
				.catch(() => {
					toast({
						title: "😓 Failed to join group",
						variant: "destructive",
					});
				});
		}
	};

	// console.log(`${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${studyGroup.imageUrl}`);

	return (
		<div
			className={`relative flex flex-col max-w-[47%] lg:max-w-[280px] max-h-[380px]  border rounded-sm cursor-pointer  transition-all ${
				isUserGroup && "hover:scale-105"
			}`}
			onClick={() => handleClickCard()}
		>
			{!isImageLoaded && (
				<>
					<div className="absolute w-full h-full bg-background"></div>
					<Skeleton className="absolute w-full h-full" />
				</>
			)}
			<img
				src={`${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${studyGroup.imageUrl}`}
				alt="cover"
				className="flex-1 object-cover w-full overflow-hidden rounded-sm max-h-[50%]"
				loading="eager"
				onLoad={() => setIsImageLoaded(true)}
			/>

			<div className="flex flex-col flex-1 gap-1 p-5 max-h-[50%]">
				<div className="flex gap-2 text-xs text-gray-500">
					<UsersIcon className="w-4 h-4 text-blue-500" />
					<span className="text-gray-500">{studyGroup.memberCount} members</span>
				</div>
				<h2 className="">{studyGroup.name}</h2>
				<p className="overflow-hidden text-xs text-left text-gray-500 line-clamp-3"> {studyGroup.description}</p>
				{(!isUserGroup && isImageLoaded) && (
					<Button
						className={`p-4 mt-auto ${
							isJoined
								? "text-white bg-green-700 hover:bg-green-700"
								: "transition-all hover:scale-105"
						}`}
					>
						{isJoined ? "Joined" : "Join"}
					</Button>
				)}
			</div>
		</div>
	);
};

export default GroupDisplayCard;
