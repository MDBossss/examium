import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, FileIcon, LibraryIcon, ServerCrashIcon } from "lucide-react";
import { ElementRef, Fragment, useRef } from "react";
import { useParams } from "react-router-dom";
import { fetchMessagesWithFiles } from "../../api/messages";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import GenerateMultipleSkeletons from "../GenerateMultipleSkeletons";
import { MessageType } from "../../../../shared/models";
import { getFileType, getFullFileUrl } from "../../utils/fileUtils";

interface Props {
	setIsShowFiles: (value: boolean) => void;
}

const ChatFiles = ({ setIsShowFiles }: Props) => {
	const triggerRef = useRef<ElementRef<"div">>(null);
	const { id } = useParams();

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
		queryKey: ["files", id],
		queryFn: ({ pageParam }) => fetchMessagesWithFiles(pageParam, id!),
		getNextPageParam: (lastPage) => lastPage?.nextCursor,
		refetchOnWindowFocus: false,
	});

	useInfiniteScroll({
		triggerRef,
		loadMore: fetchNextPage,
		shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
	});

	if (status === "loading") {
		return GenerateMultipleSkeletons({ number: 6, className: "w-full h-[200px]" });
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
		<>
			<ArrowLeftIcon
				className="absolute w-10 z-[10] h-10 p-2 transition-all rounded-full cursor-pointer top-2 left-2 hover:text-blue-500 bg-background"
				onClick={() => setIsShowFiles(false)}
			/>
			{data.pages[0].messages.length < 1 && (
				<div className="flex flex-col items-center justify-center flex-1">
					<LibraryIcon className="w-10 h-10 my-4" />
					<p className="italic">All files from the group will be shown here.</p>
				</div>
			)}

			<div className="w-full pt-5 overflow-x-hidden overflow-y-scroll md:p-5 h-max columns-2 lg:columns-3">
				{data?.pages?.map((group, i) => (
					<Fragment key={i}>
						{group.messages.map((message: MessageType) => {
							if (getFileType(message?.fileUrl!) === "image") {
								return (
									<a
										key={message.id}
										href={getFullFileUrl(message.fileUrl!)}
										target="_blank"
										rel="noopener noreferrer"
										className="block w-full mb-4"
									>
										<img
											src={getFullFileUrl(message?.fileUrl!)}
											className="w-full mb-4 transition-all rounded-sm hover:scale-105"
										/>
									</a>
								);
							} else if (getFileType(message.fileUrl!) === "document") {
								return (
									<a
										key={message.id}
										href={getFullFileUrl(message.fileUrl!)}
										target="_blank"
										rel="noopener noreferrer"
										className="block w-full col-span-1 mb-4 transition-all border border-indigo-500 rounded-sm cursor-pointer wrap-word hover:scale-105"
									>
										<div className="flex flex-col items-center mb-4 text-center justfy-center">
											<FileIcon className="w-1/2 text-indigo-500 transition-all h-1/2 min-w-10 min-h-10" />
											<p className="text-xs">{message.fileUrl?.substring(14)}</p>
										</div>
									</a>
								);
							} else {
								return null;
							}
						})}
					</Fragment>
				))}
			</div>

			<div ref={triggerRef} className="flex h-1 mt-1" />
		</>
	);
};

export default ChatFiles;
