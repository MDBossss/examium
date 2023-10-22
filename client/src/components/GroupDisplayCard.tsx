import { UsersIcon } from "lucide-react";
import { StudyGroupType } from "../../../shared/models";
import { useNavigate } from "react-router-dom";

interface Props {
	studyGroup: StudyGroupType;
}

const GroupDisplayCard = ({ studyGroup }: Props) => {
	const navigate = useNavigate();

	return (
		<div
			className="flex flex-col aspect-square max-w-[280px] max-h-[280px] flex-1 border rounded-sm cursor-pointer  transition-all hover:scale-105"
			onClick={() => navigate(`/groups/${studyGroup.id}`)}
		>
			<div
				className="flex-1 bg-cover rounded-sm"
				style={{
					backgroundImage: `url(${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${
						studyGroup.imageUrl
					})`,
				}}
			/>
			<div className="flex flex-col gap-1 p-5">
				<div className="flex gap-2 text-xs text-gray-500">
					<UsersIcon className="w-4 h-4 text-blue-500" />
					<span className="text-gray-500">{studyGroup.memberCount} members</span>
				</div>
				<h2 className="">{studyGroup.name}</h2>
				<p className="text-xs text-left text-gray-500"> {studyGroup.description}</p>
			</div>
		</div>
	);
};

export default GroupDisplayCard;
