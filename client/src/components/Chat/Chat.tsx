import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

interface Props{
	isOwner: boolean
}

const Chat = ({isOwner}: Props) => {
	return (
		<div className="flex flex-col justify-end flex-1 gap-2 p-2 rouned-sm bg-slate-200 dark:bg-gray-900 ">
			<ChatMessages isOwner={isOwner}/>
			<ChatInput />
		</div>
	);
};

export default Chat;
