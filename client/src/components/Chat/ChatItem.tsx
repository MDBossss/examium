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

interface Props {
	message: MessageType;
	isOwner: boolean;
}

const ChatItem = ({ message, isOwner }: Props) => {
	const { session } = useSession();
	const navigate = useNavigate();
	const { theme } = useThemeStore();
	const {toast} = useToast();

	const isCreator = message.member?.userId === session?.user.id;
	const canDeleteMessage = !message.deleted && (isOwner || isCreator);
	const fileType = getFileType(message.fileUrl || "");


	const handleDeleteMessage = async () => {
		await deleteMessage(message.id)
		.then(() => {
			toast({
				title: "✅ Message deleted successfully",
			});
		}).catch(() => {
			toast({
				title: "😓 Failed to delete message",
				variant: "destructive",
			});
		})
	};
	return (
		<div
			className={`${
				isCreator ? "flex-row-reverse self-end" : "flex-row"
			} flex gap-1 md:w-[60%]`}
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
				} w-fit relative flex flex-col group p-2 rounded-sm h-min`}
			>
				<p className="text-xs text-blue-500 dark:text-blue-300">{`${
					isCreator ? "You" : message.member?.user.firstName
				} • ${getTimeAgo(message.updatedAt!)}`}</p>
				<p className={`${message.deleted ? "text-xs italic opacity-80" : ""}`}>{message.content}</p>
				{message.testId && (
					<div className="flex flex-col min-w-[200px]">
						<p className="text-xs text-left text-blue-500 dark:text-blue-300">{`${message.member?.user.firstName} shared a test.`}</p>
						<div
							className={`${
								theme === "dark" ? "bg-doodle-dark" : "bg-doodle-light"
							} border flex items-center justify-between gap-1 p-2 rounded-sm `}
						>
							<p className="font-bold">{message?.test?.title}</p>
							<Button
								size={"sm"}
								className="bg-green-500 hover:bg-green-600"
								onClick={() => navigate(`/solve/${message.testId}`)}
							>
								Start
							</Button>
						</div>
					</div>
				)}
				{fileType === "image" && (
					<a href={getFullFileUrl(message.fileUrl!)} target="_blank" rel="noopener noreferrer">
						<div className="flex h-min">
							<img src={getFullFileUrl(message.fileUrl!)} />
						</div>
					</a>
				)}
				{fileType === "document" && (
					<a href={getFullFileUrl(message.fileUrl!)} target="_blank" rel="noopener noreferrer">
						<div className="flex items-center gap-2 p-2 bg-gray-900 rounded-sm ">
							<FileIcon className="w-10 h-10 text-orange-600 fill-indigo-200 stroke-indigo-400" />
							<p className="text-xs text-indigo-200 truncate">{message.fileUrl?.substring(14)}</p>
						</div>
					</a>
				)}
				{canDeleteMessage && (
						<div className={`${isCreator ? "left-2" : "right-2"} absolute items-center hidden p-1 bg-white border rounded-sm group-hover:flex gap-x-2 -top-2 dark:bg-gray-800`}>
							<ActionTooltip label="Delete">
								<TrashIcon
									onClick={() => handleDeleteMessage()}
									className="w-4 h-4 mr-auto transition cursor-pointer"
								/>
							</ActionTooltip>
						</div>
					)}
			</div>
		</div>
	);
};

export default ChatItem;
