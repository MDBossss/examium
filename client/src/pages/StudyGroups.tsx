import { PlusIcon } from "lucide-react";

const StudyGroups = () => {
	return (
		<>
			<div className="flex flex-col mb-10 text-center border-b border-slate-200 dark:border-gray-800 sm:text-left">
				<h1 className="text-2xl font-bold">Study Groups</h1>
				<p className="pt-3 pb-3 text-sm text-slate-400">
					Meet classmates from your school, create and share groups, all in one place.
				</p>
			</div>
			<div className="flex flex-wrap gap-5">
				<div className="flex flex-col cursor-pointer text-gray-500 hover:text-foreground hover:font-bold aspect-video text-center max-w-[280px] flex-1 gap-5 p-5 border">
					<PlusIcon className="w-full h-full" />
					<h2>Join / Create</h2>
				</div>
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
