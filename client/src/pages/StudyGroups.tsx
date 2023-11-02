import { ClipboardPasteIcon } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useState } from "react";
import CreateStudyGroupDialog from "../components/ui/Dialogs/CreateStudyGroupDialog";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@clerk/clerk-react";
import { getPublicStudyGroups, getUserStudyGroups } from "../api/groups";
import GenerateMultipleSkeletons from "../components/GenerateMultipleSkeletons";
import GroupDisplayCard from "../components/GroupDisplayCard";

const StudyGroups = () => {
	const [joinCode, setJoinCode] = useState<string>("");
	const { session } = useSession();

	const handlePaste = async () => {
		const clipboard = await navigator.clipboard.readText();
		setJoinCode(clipboard);
	};

	const {
		data: userGroups,
		isLoading: isUserGroupsLoading,
		isError: isUserGroupsError,
		refetch: refetchUserGroups,
	} = useQuery({
		queryKey: ["groups", "user", session?.user.id],
		queryFn: () => getUserStudyGroups(session?.user.id!),
		refetchOnWindowFocus: false,
	});

	const {
		data: publicGroups,
		isLoading: isPublicGroupsLoading,
		isError: isPublicGroupsError,
		refetch: refetchPublicGroups
	} = useQuery({
		queryKey: ["groups"],
		queryFn: () => getPublicStudyGroups(),
		refetchOnWindowFocus: false,
	});

	const handleGroupJoin = () => {
		refetchPublicGroups();
		refetchUserGroups();
	}

	return (
		<>
			<div className="flex flex-col items-center justify-between text-center border-b md:flex-row border-slate-200 dark:border-gray-800 sm:text-left">
				<div>
					<h1 className="text-2xl font-bold">Study Groups</h1>
					<p className="pt-3 pb-3 text-sm text-slate-400">
						Meet classmates from your school, create and share groups, all in one place.
					</p>
				</div>
				<CreateStudyGroupDialog onCreated={() => refetchUserGroups()}>
					<Button className="w-full m-2 md:w-fit">Create Study Group</Button>
				</CreateStudyGroupDialog>
			</div>
			<div className="flex flex-wrap gap-5">
				<div className="flex flex-col text-center max-w-[280px] max-h-[380px] flex-1 gap-5 p-5 border rounded-sm">
					<div className="flex flex-col gap-1">
						<h2 className="text-lg font-bold text-left">Join group</h2>
						<p className="text-xs text-left text-gray-500">
							Join a group by entering the invite code
						</p>
					</div>
					<div className="relative">
						<Input
							placeholder="Enter invite code..."
							className="pr-10"
							value={joinCode}
							onChange={(e) => setJoinCode(e.target.value)}
						/>
						<ClipboardPasteIcon
							className="absolute top-0 right-0 w-10 h-10 p-2 border-l rounded-sm cursor-pointer hover:bg-gray-800"
							onClick={handlePaste}
						/>
					</div>
					<Button disabled={!joinCode} className="mt-auto">
						Join
					</Button>
				</div>
				{isUserGroupsLoading && (
					<GenerateMultipleSkeletons
						number={3}
						className="aspect-square  max-w-[280px] max-h-[280px] rouned-sm"
					/>
				)}
				{userGroups &&
					!isUserGroupsLoading &&
					userGroups.map((group) => (
						<GroupDisplayCard studyGroup={group} key={group.id} isUserGroup={true} />
					))}
				{isUserGroupsError && <p>😓 Couldn't load your groups, try again.</p>}
			</div>
			<div className="relative flex flex-col gap-5">
				<div className="absolute w-full p-2 border-b "></div>
				<div className="flex justify-center">
					<h1 className="z-10 px-5 text-lg font-bold bg-background">Public Groups</h1>
				</div>
				<div className="flex flex-wrap gap-5">
					{isPublicGroupsLoading && (
						<GenerateMultipleSkeletons
							number={3}
							className="aspect-square  max-w-[280px] max-h-[280px] rouned-sm"
						/>
					)}
					{publicGroups &&
						!isPublicGroupsLoading &&
						publicGroups.map((group) => (
							<GroupDisplayCard studyGroup={group} key={group.id} isUserGroup={false} isJoined={userGroups?.some((g) => g.id === group.id)} onGroupJoin={() => handleGroupJoin()}/>
						))}
					{isPublicGroupsError && <p>😓 Couldn't load your groups, try again.</p>}
				</div>
			</div>
		</>
	);
};

export default StudyGroups;
