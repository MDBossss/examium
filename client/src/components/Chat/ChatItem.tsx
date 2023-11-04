import { useSession } from "@clerk/clerk-react";
import { MessageType } from "../../../../shared/models";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import Spinner from "../ui/Spinner";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../../store/themeStore";
import { getTimeAgo } from "../../utils/dateUtils";
import { getFileType, getFullFileUrl } from "../../utils/fileUtils";
import { FileIcon, TrashIcon } from "lucide-react";
import { ActionTooltip } from "../ui/ActionTooltip";
import { deleteMessage } from "../../api/messages";
import { useToast } from "../../hooks/useToast";
import { useState } from "react";
import { Skeleton } from "../ui/Skeleton";
import { formatLinks } from "../../utils/testUtils";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../ui/Dialogs/AlertDialog";

interface Props {
	message: MessageType;
	isOwner: boolean;
}

const ChatItem = ({ message, isOwner }: Props) => {
	const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	const { session } = useSession();
	const navigate = useNavigate();
	const { theme } = useThemeStore();
	const { toast } = useToast();

	const isCreator = message.member?.userId === session?.user.id;
	const canDeleteMessage = !message.deleted && (isOwner || isCreator);
	const fileType = getFileType(message.fileUrl || "");

	const handleDeleteMessage = async () => {
		await deleteMessage(message.id)
			.then(() => {
				toast({
					title: "✅ Message deleted successfully",
				});
			})
			.catch(() => {
				toast({
					title: "😓 Failed to delete message",
					variant: "destructive",
				});
			});
	};
	return (
		<>
			<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This message will be deleted.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-red-500 hover:bg-red-600"
							onClick={() => handleDeleteMessage()}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<div
				className={`${
					isCreator ? "flex-row-reverse self-end" : "flex-row"
				} flex gap-1 max-w-[60%] break-text`}
			>
				{!isCreator && (
					<Avatar>
						<AvatarImage src={message.member?.user.imageUrl} />
						<AvatarFallback>
							<Spinner />
						</AvatarFallback>
					</Avatar>
				)}

				<div
					className={` ${
						isCreator
							? "justify-end bg-blue-300 dark:bg-blue-600 text-right"
							: "justify-start bg-background text-left"
					} w-fit relative flex flex-col group p-2 rounded-sm h-min shadow-sm  overflow-ellipsis flex-wrap `}
				>
					<p className="text-xs text-blue-500 dark:text-blue-300">{`${
						isCreator ? "You" : message.member?.user.firstName
					} • ${getTimeAgo(message.updatedAt!)}`}</p>
					<p
						className={`${
							message.deleted ? "text-xs italic opacity-80" : ""
						} break-all overflow-ellipsis`}
					>
						{formatLinks(message.content)}
					</p>
					{message.testId && (
						<div className="flex flex-col md:min-w-[200px]">
							<p className="text-xs text-left text-blue-500 dark:text-blue-300">{`${message.member?.user.firstName} shared a test.`}</p>
							<div
								className={`${
									theme === "dark" ? "bg-doodle-dark" : "bg-doodle-light"
								} border flex flex-col lg:flex-row items-center justify-between gap-1 p-2 rounded-sm`}
							>
								<ActionTooltip label={message.test?.title!}>
									<p className="font-bold ">{message?.test?.title}</p>
								</ActionTooltip>
								<Button
									size={"sm"}
									className="w-full bg-green-500 hover:bg-green-600 lg:w-max"
									onClick={() => navigate(`/solve/${message.testId}`)}
								>
									Start
								</Button>
							</div>
						</div>
					)}
					{fileType === "image" && (
						<a
							href={getFullFileUrl(message.fileUrl!)}
							target="_blank"
							rel="noopener noreferrer"
							className="relative"
						>
							{!isImageLoaded && <Skeleton className="w-max aspect-video" />}
							<div className="flex h-min">
								<img
									src={getFullFileUrl(message.fileUrl!)}
									alt="message image"
									onLoad={() => setIsImageLoaded(true)}
								/>
							</div>
						</a>
					)}
					{fileType === "document" && (
						<a href={getFullFileUrl(message.fileUrl!)} target="_blank" rel="noopener noreferrer">
							<div className="flex items-center gap-2 p-2 break-all rounded-sm bg-slate-200 dark:bg-gray-900 ">
								<FileIcon className="w-10 h-10 text-orange-600 fill-indigo-200 stroke-indigo-400" />
								<p className="text-xs text-indigo-500 dark:text-indigo-200">
									{message.fileUrl?.substring(14)}
								</p>
							</div>
						</a>
					)}
					{canDeleteMessage && (
						<div
							className={`${
								isCreator ? "left-2" : "right-2"
							} z-10 absolute items-center hidden p-1 bg-white border rounded-sm group-hover:flex gap-x-2 -top-2 dark:bg-gray-800`}
						>
							<ActionTooltip label="Delete">
								<TrashIcon
									onClick={() => setIsDialogOpen(true)}
									className="w-4 h-4 mr-auto transition cursor-pointer"
								/>
							</ActionTooltip>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default ChatItem;
