import { ClipboardPasteIcon } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useState } from "react";
import CreateStudyGroupDialog from "../components/ui/Dialogs/CreateStudyGroupDialog";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@clerk/clerk-react";
import { getUserStudyGroups } from "../api/groups";
import GenerateMultipleSkeletons from "../components/GenerateMultipleSkeletons";
import GroupDisplay from "../components/GroupDisplayCard";

const StudyGroups = () => {
	const [joinLink, setJoinLink] = useState<string>("");
	const { session } = useSession();

	const handlePaste = async () => {
		const clipboard = await navigator.clipboard.readText();
		setJoinLink(clipboard);
	};

	const {
		data: userGroups,
		isLoading: userIsLoading,
		isError: userIsError,
		refetch,
	} = useQuery({
		queryKey: ["groups", "user", session?.user.id],
		queryFn: () => getUserStudyGroups(session?.user.id!),
		refetchOnWindowFocus: false,
	});

	const handleOnCreated = () => {
		refetch();
	};

	return (
		<>
			<div className="flex flex-col items-center justify-between text-center border-b md:flex-row border-slate-200 dark:border-gray-800 sm:text-left">
				<div>
					<h1 className="text-2xl font-bold">Study Groups</h1>
					<p className="pt-3 pb-3 text-sm text-slate-400">
						Meet classmates from your school, create and share groups, all in one place.
					</p>
				</div>
				<CreateStudyGroupDialog onCreated={handleOnCreated}>
					<Button className="w-full m-2 md:w-fit">Create Study Group</Button>
				</CreateStudyGroupDialog>
			</div>
			<div className="flex flex-wrap gap-5">
				<div className="flex flex-col aspect-square text-center max-w-[280px] max-h-[280px] flex-1 gap-5 p-5 border rounded-sm">
					<div className="flex flex-col gap-1">
						<h2 className="text-lg font-bold text-left">Join group</h2>
						<p className="text-xs text-left text-gray-500">
							Join a group by entering the invite link
						</p>
					</div>
					<div className="relative">
						<Input
							placeholder="Enter invite link..."
							className="pr-10"
							value={joinLink}
							onChange={(e) => setJoinLink(e.target.value)}
						/>
						<ClipboardPasteIcon
							className="absolute top-0 right-0 w-10 h-10 p-2 border-l rounded-sm cursor-pointer hover:bg-gray-800"
							onClick={handlePaste}
						/>
					</div>
					<Button disabled={!joinLink} className="mt-auto">
						Join
					</Button>
				</div>
				{userIsLoading && (
					<GenerateMultipleSkeletons
						number={3}
						className="aspect-square  max-w-[280px] max-h-[280px] rouned-sm"
					/>
				)}
				{userGroups &&
					!userIsLoading &&
					userGroups.map((group) => <GroupDisplay studyGroup={group} key={group.id} />)}
				{userIsError && <p>😓 Couldn't load your groups, try again.</p>}
			</div>
			<div className="relative flex flex-col gap-5">
				<div className="absolute w-full p-2 border-b "></div>
				<div className="flex justify-center">
					<h1 className="z-10 px-5 text-lg font-bold bg-background">Public Groups</h1>
				</div>
			</div>
		</>
	);
};

export default StudyGroups;
