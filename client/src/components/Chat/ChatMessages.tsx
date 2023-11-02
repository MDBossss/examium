import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchMessages } from "../../api/messages";
import { useSocket } from "../SocketProvider";
import GenerateMultipleSkeletons from "../GenerateMultipleSkeletons";
import { ServerCrashIcon } from "lucide-react";
import { ElementRef, Fragment, useRef } from "react";
import { MessageType } from "../../../../shared/models";
import ChatItem from "./ChatItem";
import { useChatSocket } from "../../hooks/useChatSocket";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import Spinner from "../ui/Spinner";

interface Props {
	isOwner: boolean;
}

const ChatMessages = ({ isOwner }: Props) => {
	const triggerRef = useRef<ElementRef<"div">>(null);
	const bottomRef = useRef<ElementRef<"div">>(null);
	const { id } = useParams();
	const addKey = `chat:${id}:messages`;
	const queryKey = `chat:${id}`;
	const updateKey = `chat:${id}:messages:update`;

	const { isConnected } = useSocket();

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
		queryKey: [queryKey],
		queryFn: ({ pageParam }) => fetchMessages(pageParam, id!),
		getNextPageParam: (lastPage) => lastPage?.nextCursor,
		refetchOnWindowFocus: false,
		refetchInterval: isConnected ? false : 1000,
	});

	useChatSocket({ addKey, queryKey, updateKey });
	useInfiniteScroll({
		triggerRef,
		loadMore: fetchNextPage,
		shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
	});

	console.log(data);

	if (status === "loading") {
		return GenerateMultipleSkeletons({ number: 5, className: "h-5 w-full" });
	}

	if (status === "error") {
		return (
			<div className="flex flex-col items-center justify-center flex-1">
				<ServerCrashIcon className="my-4 h-7 w-7" />
				<p className="text-xs">Something went wrong!</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col-reverse gap-1 mt-auto overflow-y-scroll scroll-hidden">
			{data?.pages?.map((group, i) => (
				<Fragment key={i}>
					{group.messages.map((message: MessageType) => (
						<ChatItem key={message.id} message={message} isOwner={isOwner} />
					))}
				</Fragment>
			))}
			{isFetchingNextPage && <Spinner/>}
			<div ref={triggerRef} className="flex h-1" />
		</div>
	);
};

export default ChatMessages;