import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getStudyGroupById, leaveStudyGroup } from "../api/groups";
import { Skeleton } from "../components/ui/Skeleton";
import { useSession } from "@clerk/clerk-react";
import CreateStudyGroupDialog from "../components/ui/Dialogs/CreateStudyGroupDialog";
import { useState } from "react";
import { StudyGroupType } from "../../../shared/models";
import { Button } from "../components/ui/Button";
import {
	ChevronDownIcon,
	ChevronUpIcon,
	CopyIcon,
	LogOutIcon,
	SettingsIcon,
	UsersIcon,
} from "lucide-react";
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
import ChatMessages from "../components/Chat/ChatMessages";
import ChatInput from "../components/Chat/ChatInput";
import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatFiles from "../components/Chat/ChatFiles";
import { Sheet, SheetContent } from "../components/ui/Sheet";

const StudyGroupChat = () => {
	const { id } = useParams();
	const { session } = useSession();
	const navigate = useNavigate();
	const { toast } = useToast();
	const [studyGroup, setStudyGroup] = useState<StudyGroupType>();
	const [isShowFiles, setIsShowFiles] = useState<boolean>(false);
	const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
	const [isHeaderExpanded, setIsHeaderExpanded] = useState<boolean>(false);
	const [isSheetVisible, setIsSheetVisible] = useState<boolean>(false);

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
				<Skeleton className="h-[500px] w-full" />
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
					<p className="hidden pt-3 pb-3 text-sm md:block text-slate-400">
						{studyGroup?.description}
					</p>
				</div>
				{isHeaderExpanded && (
					<p className="pt-3 pb-3 text-sm text-center md:hidden text-slate-400">
						{studyGroup?.description}
					</p>
				)}

				<div className="flex-col items-center hidden w-full gap-2 md:flex md:w-fit md:flex-row">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="w-full md:w-fit">
								<SettingsIcon className="w-6 h-6 text-slate-400 dark:text-gray-600" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56">
							<DropdownMenuItem className="flex gap-1" onClick={() => handleCopyInviteLink()}>
								<CopyIcon className="w-4 h-4" /> Copy invite link
							</DropdownMenuItem>
							{!isOwner && (
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<div className="flex gap-1 text-red-500 dark:text-red-600 relative select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors cursor-pointer focus:bg-slate-200 dark:focus:bg-gray-800 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-slate-200 dark:hover:bg-gray-800">
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
							)}
						</DropdownMenuContent>
					</DropdownMenu>

					{studyGroup?.ownerId === session?.user.id && (
						<CreateStudyGroupDialog
							defaultStudyGroup={studyGroup}
							onCreated={(studyGroup) => setStudyGroup(studyGroup)}
						>
							<Button className="w-full m-2 md:w-max">Edit group</Button>
						</CreateStudyGroupDialog>
					)}
				</div>

				{isHeaderExpanded && (
					<div className="flex flex-col items-center w-full gap-2 md:hidden md:w-fit md:flex-row">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="w-full md:w-fit">
									<SettingsIcon className="w-6 h-6 text-slate-400 dark:text-gray-600" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56">
								<DropdownMenuItem className="flex gap-1" onClick={() => handleCopyInviteLink()}>
									<CopyIcon className="w-4 h-4" /> Copy invite link
								</DropdownMenuItem>
								{!isOwner && (
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<div className="flex gap-1 text-red-500 dark:text-red-600 relative select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors cursor-pointer focus:bg-slate-200 dark:focus:bg-gray-800 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-slate-200 dark:hover:bg-gray-800">
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
								)}
							</DropdownMenuContent>
						</DropdownMenu>

						{studyGroup?.ownerId === session?.user.id && (
							<CreateStudyGroupDialog
								defaultStudyGroup={studyGroup}
								onCreated={(studyGroup) => setStudyGroup(studyGroup)}
							>
								<Button className="w-full m-2 md:w-max">Edit group</Button>
							</CreateStudyGroupDialog>
						)}
						<Button
							className="flex w-full gap-1 m-2 md:hidden"
							onClick={() => setIsSheetVisible(true)}
						>
							<UsersIcon className="w-4 h-4" /> Expand sidebar
						</Button>
					</div>
				)}
				{isHeaderExpanded ? (
					<ChevronUpIcon
						className="cursor-pointer md:hidden"
						onClick={() => setIsHeaderExpanded(false)}
					/>
				) : (
					<ChevronDownIcon
						className="cursor-pointer md:hidden"
						onClick={() => setIsHeaderExpanded(true)}
					/>
				)}
			</div>
			<div className="flex flex-1 w-full gap-5 mx-auto overflow-y-auto max-w-7xl">
				<div className="relative flex flex-col justify-end flex-1 gap-2 p-2 rouned-sm bg-slate-200 dark:bg-gray-900 ">
					{isShowFiles ? (
						<ChatFiles setIsShowFiles={setIsShowFiles} />
					) : (
						<>
							<ChatMessages isOwner={isOwner} />
							<ChatInput setIsFileSelected={setIsFileSelected} />
						</>
					)}
				</div>

				<ChatSidebar
					studyGroup={studyGroup}
					setIsShowFiles={setIsShowFiles}
					setIsSheetVisible={setIsSheetVisible}
					isFileSelected={isFileSelected}
					isVisible={false}
				/>

				<Sheet open={isSheetVisible} onOpenChange={setIsSheetVisible}>
					<SheetContent>
						<ChatSidebar
							studyGroup={studyGroup}
							setIsSheetVisible={setIsSheetVisible}
							setIsShowFiles={setIsShowFiles}
							isFileSelected={isFileSelected}
							isVisible={true}
						/>
					</SheetContent>
				</Sheet>
			</div>
		</>
	);
};

export default StudyGroupChat;
