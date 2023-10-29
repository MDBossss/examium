import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchMessages } from "../../api/messages";
import { useSocket } from "../SocketProvider";
import GenerateMultipleSkeletons from "../GenerateMultipleSkeletons";
import { ServerCrashIcon } from "lucide-react";
import { Fragment } from "react";
import { MessageType } from "../../../../shared/models";
import ChatItem from "./ChatItem";

const ChatMessages = () => {
	const { id } = useParams();
	const { isConnected } = useSocket();

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
		queryKey: ["messages", id],
		queryFn: ({ pageParam }) => fetchMessages(pageParam, id!),
		getNextPageParam: (lastPage) => lastPage?.nextCursor,
		refetchOnWindowFocus: false,
		// refetchInterval: isConnected ? false : 1000
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

	return <div className="flex flex-col-reverse gap-1 mt-auto overflow-y-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.messages.map((message: MessageType) => (
              <ChatItem
                key={message.id}
                message={message}
              />
            ))}
          </Fragment>
        ))}
    </div>
};

export default ChatMessages;
