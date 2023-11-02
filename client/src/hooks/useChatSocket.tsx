import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../components/SocketProvider";
import { useEffect } from "react";
import { MessageType } from "../../../shared/models";

interface Props {
	addKey: string;
	updateKey: string;
	queryKey: string;
}

export const useChatSocket = ({ addKey, updateKey, queryKey }: Props) => {
	const { socket } = useSocket();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!socket) {
			return;
		}

		socket.on(updateKey, (message: MessageType) => {
			queryClient.setQueryData([queryKey], (oldData: any) => {
				if (!oldData || !oldData.pages || oldData.pages.length === 0) {
					return oldData;
				}

				const newData = oldData.pages.map((page: any) => {
					return {
						...page,
						messages: page.messages.map((item: MessageType) => {
							if (item.id === message.id) {
								return message;
							}
							return item;
						}),
					};
				});

				return { ...oldData, pages: newData };
			});
		});

		socket.on(addKey, (message: MessageType) => {
			queryClient.setQueryData([queryKey], (oldData: any) => {
				if (!oldData || !oldData.pages || oldData.pages.length === 0) {
					return {
						pages: [
							{
								messages: [message],
							},
						],
					};
				}

				const newData = [...oldData.pages];


				newData[0] = {
					...newData[0],
					messages: [message, ...newData[0].messages],
				};

				return {
					...oldData,
					pages: newData,
				};
			});
		});

		return () => {
			socket.off(addKey);
			socket.off(updateKey);
		};
	}, [queryClient, addKey, queryKey, socket, updateKey]);
};
