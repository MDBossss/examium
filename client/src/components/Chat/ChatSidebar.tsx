import { FolderIcon } from "lucide-react";
import { StudyGroupType } from "../../../../shared/models";
import MemberListItem from "../MemberListItem";

interface Props {
	studyGroup: StudyGroupType | undefined;
	setIsShowFiles: (value: boolean) => void;
	setIsSheetVisible : (value:boolean) => void;
	isFileSelected: boolean;
	isVisible:boolean
}

const ChatSidebar = ({ studyGroup, setIsShowFiles, isFileSelected, isVisible,setIsSheetVisible }: Props) => {

	const handleClickFiles = () => {
		setIsShowFiles(true);
		setIsSheetVisible(false);
	}

	return (
		<aside className={`${isVisible ? "h-full flex flex-col border-l-0" : "hidden"} p-1 border-l md:pl-5 md:pt-5 md:flex md:flex-col max-w-[200px]`}>
			<p className=" text-slate-400">Members</p>
			<div className="flex flex-col flex-1 overflow-y-auto">
				{studyGroup?.members?.map((member) => (
					<MemberListItem
						key={member.id}
						member={member}
						isOwner={member.user.id === studyGroup.ownerId}
					/>
				))}
			</div>
			<div>
				<button
					disabled={isFileSelected}
					onClick={() => handleClickFiles()}
					className={`${isFileSelected ? " opacity-50" : "hover:scale-105"} relative flex items-end w-full gap-1 p-5 text-2xl text-blue-500 transition-all bg-blue-300 rounded-sm shadow-sm dark:text-blue-300 dark:bg-blue-600`}
				>
					<div className="absolute w-3 h-3 p-1 bg-blue-500 border-4 rounded-full dark:bg-blue-300 border-slate-200 dark:border-gray-950 top-2 left-2"></div>
					<FolderIcon className="w-10 h-10 " />
					<div className="flex flex-col gap-1">
						<h5 className="text-sm">All Files</h5>
						<p className="text-3xl">231</p>
					</div>
				</button>
			</div>
		</aside>
	);
};

export default ChatSidebar;
