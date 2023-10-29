import { useSession } from "@clerk/clerk-react";
import { MessageType } from "../../../../shared/models";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import Spinner from "../ui/Spinner";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../../store/themeStore";

interface Props {
	message: MessageType;
}

const ChatItem = ({ message }: Props) => {
	const { session } = useSession();
	const navigate = useNavigate();
	const { theme } = useThemeStore();

	const isCreator = message.member?.userId === session?.user.id;

	return (
		<div
			className={`${
				isCreator ? "flex-row-reverse self-end" : "flex-row"
			} flex gap-1  md:w-[60%]`}
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
						? "justify-end bg-blue-500 dark:bg-blue-600 text-right"
						: "justify-start bg-background text-left"
				} w-fit flex flex-col p-2 rounded-sm h-min`}
			>
				{/* //todo make a function which will make a string based how long ago this was */}
				<p className="text-xs text-blue-300">{`${
					isCreator ? "You" : message.member?.user.firstName
				} • ${new Date(message.updatedAt!).toLocaleTimeString()}`}</p>
				<p>{message.content}</p>
				{message.testId && (
					<div className="flex flex-col">
						<p className="text-xs text-left text-blue-300">{`${message.member?.user.firstName} shared a test.`}</p>
						<div
							className={`${
								theme === "dark" ? "bg-doodle-dark" : "bg-doodle-light"
							} flex items-center justify-between gap-1 p-2 border rounded-sm border-slate-200 dark:border-zinc-900`}
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
				{message.fileUrl && (
					<div className="flex h-min">
						<img src={`${import.meta.env.VITE_SUPABASE_BUCKET_LINK}${message.fileUrl}`} />
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatItem;
