import { ShieldCheckIcon, UserXIcon } from "lucide-react";
import { MemberType } from "../../../shared/models";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import Spinner from "./ui/Spinner";
import { ActionTooltip } from "./ui/ActionTooltip";
import { useSession } from "@clerk/clerk-react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "./ui/ContextMenu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/Dialogs/AlertDialog";
import { leaveStudyGroup } from "../api/groups";
import { useToast } from "../hooks/useToast";

interface Props {
	member: MemberType;
	isOwner: boolean;
	studyGroupId: string;
}

const MemberListItem = ({ member, isOwner, studyGroupId }: Props) => {
	const { session } = useSession();
	const { toast } = useToast();

	const isSelf = member.userId === session?.user.id;
	const canKick = !isSelf && !isOwner;

	const handleKickUser = async () => {
		await leaveStudyGroup(studyGroupId, member.userId)
			.then(() => {
				toast({
					title: "✅ User kicked successfully.",
				});
			})
			.catch(() => {
				toast({
					title: "😓 Failed to kick user",
					variant: "destructive",
				});
			});
	};

	return (
		<AlertDialog>
			<ContextMenu modal={false}>
				<ContextMenuTrigger asChild>
					<button className="flex items-center w-full gap-2 p-3 rounded-sm cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800">
						<Avatar className="w-8 h-8 ">
							<AvatarImage src={member.user.imageUrl} />
							<AvatarFallback>
								<Spinner />
							</AvatarFallback>
						</Avatar>
						<span className="flex items-center gap-1 font-medium">
							{member.user.firstName}{" "}
							{isOwner && (
								<ActionTooltip label="Owner">
									<ShieldCheckIcon className="w-4 h-4 text-blue-500" />
								</ActionTooltip>
							)}
						</span>
					</button>
				</ContextMenuTrigger>
				{canKick && (
					<ContextMenuContent className="w-10">
						<AlertDialogTrigger asChild>
							<ContextMenuItem className="flex gap-1 text-red-500 dark:text-red-600">
								<UserXIcon className="w-4 h-4" /> Kick user
							</ContextMenuItem>
						</AlertDialogTrigger>
					</ContextMenuContent>
				)}
			</ContextMenu>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						{`Are you sure you want to kick ${member.user.firstName}`}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className="bg-red-500 hover:bg-red-600"
						onClick={() => handleKickUser()}
					>
						Kick
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default MemberListItem;
