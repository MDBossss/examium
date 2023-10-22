import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getStudyGroupById } from "../api/groups";
import { Skeleton } from "../components/ui/Skeleton";
import MemberListItem from "../components/MemberListItem";
import { useSession } from "@clerk/clerk-react";
import CreateStudyGroupDialog from "../components/ui/Dialogs/CreateStudyGroupDialog";
import { useState } from "react";
import { StudyGroupType } from "../../../shared/models";
import { Button } from "../components/ui/Button";
import { SettingsIcon } from "lucide-react";

const StudyGroupChat = () => {
	const { id } = useParams();
	const { session } = useSession();
	const [studyGroup, setStudyGroup] = useState<StudyGroupType>();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["groups", id],
		queryFn: () => getStudyGroupById(id!),
		refetchOnWindowFocus: false,
		onSuccess: (data) => setStudyGroup(data),
	});

	if (isLoading) {
		return (
			<div className="flex flex-col">
				<Skeleton className="h-[100px] w-full" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex items-center justify-center w-full text-center">
				😓 Couldn't open study group. <br /> Please try again.
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-col items-center justify-between text-center border-b md:flex-row border-slate-200 dark:border-gray-800 sm:text-left">
				<div>
					<h1 className="text-2xl font-bold">{studyGroup?.name}</h1>
					<p className="pt-3 pb-3 text-sm text-slate-400">{studyGroup?.description}</p>
				</div>
				<div className="flex flex-col items-center w-full gap-2 md:w-fit md:flex-row">
					<Button variant="outline">
						<SettingsIcon className="w-6 h-6 text-slate-400 dark:text-gray-600" />
					</Button>

					{studyGroup?.ownerId === session?.user.id && (
						<CreateStudyGroupDialog
							defaultStudyGroup={studyGroup}
							onCreated={(studyGroup) => setStudyGroup(studyGroup)}
						>
							<Button className="m-2 md:w-fit">Edit group</Button>
						</CreateStudyGroupDialog>
					)}
				</div>
			</div>
			<div className="p-5 border-l">
				<p className=" text-slate-400">Members</p>
				{studyGroup?.members?.map((member) => (
					<MemberListItem key={member.id} member={member} />
				))}
			</div>
		</>
	);
};

export default StudyGroupChat;
