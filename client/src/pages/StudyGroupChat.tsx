import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getStudyGroupById, leaveStudyGroup } from "../api/groups";
import { Skeleton } from "../components/ui/Skeleton";
import { useSession } from "@clerk/clerk-react";
import CreateStudyGroupDialog from "../components/ui/Dialogs/CreateStudyGroupDialog";
import { useState } from "react";
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
import useWindowSize from "../hooks/useWindowSize";
import { useChatSocket } from "../hooks/useChatSocket";
import { AxiosError } from "axios";

const StudyGroupChat = () => {
	const { id } = useParams();
	const { session } = useSession();
	const navigate = useNavigate();
	const { toast } = useToast();
	const { width } = useWindowSize();
	const [isShowFiles, setIsShowFiles] = useState<boolean>(false);
	const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
	const [isHeaderExpanded, setIsHeaderExpanded] = useState<boolean>(false);
	const [isSheetVisible, setIsSheetVisible] = useState<boolean>(false);

	const queryClient = useQueryClient();

	const addKey = `chat:${id}:messages`;
	const queryKey = `chat:${id}`;
	const updateKey = `chat:${id}:messages:update`;
	const memberJoinKey = `chat:${id}:member:join`;
	const memberLeaveKey = `chat:${id}:member:leave`;

	id && useChatSocket({ id, addKey, queryKey, updateKey, memberJoinKey, memberLeaveKey });

	const isMdScreen = width > 768;

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["groups", id],
		queryFn: () => getStudyGroupById(id!, session?.user.id!),
		refetchOnWindowFocus: false,
		useErrorBoundary: false,
		retry: false,
		onError: (error: AxiosError) => {
			if (error.response?.status === 403) {
				navigate("/groups");
			}
		},
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

	if (isError && (error as AxiosError).response?.status !== 403) {
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
					<h1 className="text-2xl font-bold">{data?.name}</h1>
					{(isHeaderExpanded || isMdScreen) && (
						<p className="pt-3 pb-3 text-sm text-slate-400">{data?.description}</p>
					)}
				</div>

				{(isHeaderExpanded || isMdScreen) && (
					<div className="flex flex-col items-center w-full gap-2 md:w-fit md:flex-row">
						<AlertDialog>
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
										<AlertDialogTrigger asChild>
											<DropdownMenuItem className="flex gap-1 text-red-500 dark:text-red-600">
												<LogOutIcon className="w-4 h-4" /> Leave group
											</DropdownMenuItem>
										</AlertDialogTrigger>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
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

						{data?.ownerId === session?.user.id && (
							<CreateStudyGroupDialog
								defaultStudyGroup={data}
								onCreated={(studyGroup) => queryClient.setQueryData(["groups", id], studyGroup)}
							>
								<Button className="w-full m-2 md:w-max">Edit group</Button>
							</CreateStudyGroupDialog>
						)}
						{!isMdScreen && (
							<Button
								className="flex w-full gap-1 m-2 md:hidden"
								onClick={() => setIsSheetVisible(true)}
							>
								<UsersIcon className="w-4 h-4" /> Expand sidebar
							</Button>
						)}
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
							<ChatMessages isOwner={isOwner} queryKey={queryKey} />
							<ChatInput setIsFileSelected={setIsFileSelected} />
						</>
					)}
				</div>

				<ChatSidebar
					studyGroup={data}
					setIsShowFiles={setIsShowFiles}
					setIsSheetVisible={setIsSheetVisible}
					isFileSelected={isFileSelected}
					isVisible={false}
				/>

				<Sheet open={isSheetVisible} onOpenChange={setIsSheetVisible} modal={false}>
					<SheetContent>
						<ChatSidebar
							studyGroup={data}
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
