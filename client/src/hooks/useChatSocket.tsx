import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../components/SocketProvider";
import { useEffect } from "react";
import { MemberType, MessageType, StudyGroupType } from "../../../shared/models";

interface Props {
	id: string;
	addKey: string;
	updateKey: string;
	queryKey: string;
	memberJoinKey: string;
	memberLeaveKey: string;
}

export const useChatSocket = ({
	id,
	addKey,
	updateKey,
	queryKey,
	memberJoinKey,
	memberLeaveKey,
}: Props) => {
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

		socket.on(memberJoinKey, (member: MemberType) => {
			queryClient.setQueryData(["groups", id], (oldData: StudyGroupType | undefined) => {
				if (!oldData) {
					return oldData;
				}

				const newData = { ...oldData };

				// Update the members array with the new member
				if (newData.members && newData.members.length > 0) {
					newData.members = [...newData.members, member];
				} else {
					newData.members = [member];
				}

				// Update the member count
				newData.memberCount = (newData.memberCount || 0) + 1;


				return newData;
			});
		});

		socket.on(memberLeaveKey, (memberId: string) => {
			queryClient.setQueryData(["groups", id], (oldData: StudyGroupType | undefined) => {
				if (!oldData) {
					return oldData;
				}

				const newData = { ...oldData };

				// Remove the member from the members array
				newData.members = newData.members?.filter((member) => member.id !== memberId);

				// Update the member count
				newData.memberCount = (newData.memberCount || 0) - 1;

				return newData;
			});
		});

		return () => {
			socket.off(addKey);
			socket.off(updateKey);
			socket.off(memberJoinKey);
			socket.off(memberLeaveKey);
		};
	}, [queryClient, addKey, queryKey, socket, updateKey, memberJoinKey, memberLeaveKey]);
};
