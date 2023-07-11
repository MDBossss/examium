import { TestType } from "../types/models";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import Spinner from "./ui/Spinner";
import { Button } from "./ui/Button";
import { ActiveSessionResource } from "@clerk/types";
import { getTimeAgo } from "../utils/dateUtils";
import { useToast } from "../hooks/useToast";
import { useNavigate } from "react-router";
import { CopyIcon, EditIcon } from "lucide-react";

interface Props {
	test: TestType;
	session: ActiveSessionResource | null | undefined;
}

const TestItem = ({ test, session }: Props) => {
	const { toast } = useToast();
	const navigate = useNavigate();

	const handleCopyLink = () => {
		toast({
			description: "📋 Copied link to clipboard.",
		});
	};

	const handleEdit = () => {
		navigate(`/create/${test.id}`);
	};

	const handleStart = () => {
		//todo make a new component where /test/:id to solve
	};

	return (
		<div className="flex justify-between items-center w-full px-5 py-3 gap-5 border border-slate-200 rounded-sm">
			<div className="flex gap-3 items-center">
				<Avatar className="cursor-pointer ">
					<AvatarImage src={session?.user.imageUrl} />
					<AvatarFallback>
						<Spinner />
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<h2 className="font-medium text-zinc-800">{test.title}</h2>
					<p className="text-xs text-slate-400">
						{test.updatedAt
							? `Last updated: ${getTimeAgo(test.updatedAt)}`
							: `Created: ${getTimeAgo(test.createdAt)}`}
					</p>
				</div>
			</div>
			<div className="flex gap-3">
				<Button size="sm" variant="outline" className="hover:bg-slate-200" onClick={handleCopyLink}>
					<CopyIcon className="w-5 h-5" />
				</Button>
				<Button size="sm" className="bg-blue-500 hover:bg-blue-600" onClick={handleEdit}>
					<EditIcon className="w-5 h-5" />
				</Button>
				<Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleStart}>
					Start
				</Button>
			</div>
		</div>
	);
};

export default TestItem;
