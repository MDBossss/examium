import { ShieldCheckIcon } from "lucide-react";
import { MemberType } from "../../../shared/models";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import Spinner from "./ui/Spinner";
import { ActionTooltip } from "./ui/ActionTooltip";

interface Props {
	member: MemberType;
	isOwner: boolean;
}

const MemberListItem = ({ member, isOwner }: Props) => {
	return (
		<div className="flex items-center w-full gap-2 p-3 rounded-sm cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800">
			<Avatar className="w-8 h-8 ">
				<AvatarImage src={member.user.imageUrl} />
				<AvatarFallback>
					<Spinner />
				</AvatarFallback>
			</Avatar>
			<p className="flex items-center gap-1 font-medium">
				{member.user.firstName}{" "}
				{isOwner && (
					<ActionTooltip label="Owner">
						<ShieldCheckIcon className="w-4 h-4 text-blue-500" />
					</ActionTooltip>
				)}
			</p>
		</div>
	);
};

export default MemberListItem;
