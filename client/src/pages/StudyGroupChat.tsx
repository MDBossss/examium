import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getStudyGroupById, leaveStudyGroup } from "../api/groups";
import { Skeleton } from "../components/ui/Skeleton";
import MemberListItem from "../components/MemberListItem";
import { useSession } from "@clerk/clerk-react";
import CreateStudyGroupDialog from "../components/ui/Dialogs/CreateStudyGroupDialog";
import { useState } from "react";
import { StudyGroupType } from "../../../shared/models";
import { Button } from "../components/ui/Button";
import { CopyIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import Chat from "../components/Chat/Chat";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../components/ui/Dropdown";
import { useToast } from "../hooks/useToast";
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
} from "../components/ui/Dialogs/AlertDialog";

const StudyGroupChat = () => {
	const { id } = useParams();
	const { session } = useSession();
	const navigate = useNavigate();
	const { toast } = useToast();
	const [studyGroup, setStudyGroup] = useState<StudyGroupType>();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["groups", id],
		queryFn: () => getStudyGroupById(id!),
		refetchOnWindowFocus: false,
		onSuccess: (data) => setStudyGroup(data),
	});

	const isOwner = data?.ownerId === session?.user.id;

	const handleCopyInviteLink = async () => {
		await navigator.clipboard
			.writeText(id!)
			.then(() => {
				toast({
					title: "✅ Copied invite link.",
				});
			})
			.catch(() => {
				toast({
					title: "😓 Failed to copy invite link.",
					variant: "destructive",
				});
			});
	};

	const handleLeaveGroup = async () => {
		await leaveStudyGroup(id!, session?.user.id!)
			.then(() => {
				toast({
					title: "✅ Successfully left group.",
				});
				navigate("/groups");
			})
			.catch(() => {
				toast({
					title: "😓 Failed to leave group.",
					variant: "destructive",
				});
			});
	};

	if (isLoading) {
		return (
			<div className="flex flex-col">
				<Skeleton className="h-[100px] w-full" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex items-center justify-center w-full text-center">
				😓 Couldn't open study group. <br /> Please try again.
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-col items-center justify-between text-center border-b md:flex-row border-slate-200 dark:border-gray-800 sm:text-left">
				<div>
					<h1 className="text-2xl font-bold">{studyGroup?.name}</h1>
					<p className="pt-3 pb-3 text-sm text-slate-400">{studyGroup?.description}</p>
				</div>
				<div className="flex flex-col items-center w-full gap-2 md:w-fit md:flex-row">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								<SettingsIcon className="w-6 h-6 text-slate-400 dark:text-gray-600" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56">
							<DropdownMenuItem className="flex gap-1" onClick={() => handleCopyInviteLink()}>
								<CopyIcon className="w-4 h-4" /> Copy invite link
							</DropdownMenuItem>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<div
										className="flex gap-1 text-red-500 dark:text-red-600 relative select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors cursor-pointer focus:bg-slate-200 dark:focus:bg-gray-800 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-slate-200 dark:hover:bg-gray-800"
									>
										<LogOutIcon className="w-4 h-4" /> Leave group
									</div>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
										<AlertDialogDescription>
											Are you sure you want to leave this study group?
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											className="bg-red-500 hover:bg-red-600"
											onClick={() => handleLeaveGroup()}
										>
											Leave
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</DropdownMenuContent>
					</DropdownMenu>

					{studyGroup?.ownerId === session?.user.id && (
						<CreateStudyGroupDialog
							defaultStudyGroup={studyGroup}
							onCreated={(studyGroup) => setStudyGroup(studyGroup)}
						>
							<Button className="m-2 md:w-fit">Edit group</Button>
						</CreateStudyGroupDialog>
					)}
				</div>
			</div>
			<div className="flex flex-1 w-full gap-5 mx-auto overflow-y-auto max-w-7xl">
				<Chat isOwner={isOwner} />
				<div className="hidden p-1 border-l md:p-5 md:block max-w-[200px]">
					<p className=" text-slate-400">Members</p>
					<div className="flex flex-col overflow-y-auto">
						{studyGroup?.members?.map((member) => (
							<MemberListItem
								key={member.id}
								member={member}
								isOwner={member.user.id === data?.ownerId}
							/>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default StudyGroupChat;
