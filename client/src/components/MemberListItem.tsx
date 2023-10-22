import { MemberType } from "../../../shared/models";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import Spinner from "./ui/Spinner";

interface Props {
	member: MemberType;
}

const MemberListItem = ({ member }: Props) => {
	return (
		<div className="flex items-center gap-2 p-3 rounded-sm cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800">
			<Avatar className="w-8 h-8 ">
				<AvatarImage src={member.user.imageUrl} />
				<AvatarFallback>
					<Spinner />
				</AvatarFallback>
			</Avatar>
			<p className="font-medium">{member.user.firstName}</p>
		</div>
	);
};

export default MemberListItem;
