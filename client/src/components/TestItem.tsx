import { TestType } from "../../../shared/models";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import Spinner from "./ui/Spinner";
import { Button } from "./ui/Button";
import { getTimeAgo } from "../utils/dateUtils";
import { useToast } from "../hooks/useToast";
import { useNavigate } from "react-router";
import { CopyIcon, EditIcon, TrashIcon } from "lucide-react";
import { useSession } from "@clerk/clerk-react";
import { ActionTooltip } from "./ui/ActionTooltip";
import { useLocation } from "react-router-dom";
import { deleteBookmarkedTest } from "../api/users";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
	test: TestType;
}

const TestItem = ({ test }: Props) => {
	const { session } = useSession();
	const { toast } = useToast();
	const navigate = useNavigate();
	const location = useLocation();
	const queryClient = useQueryClient();

	const userId = session?.user.id;
	const isBookmarkPage = location.pathname.includes("bookmarked");
	const isCreator = test.authorId === userId;
	const isCollaborator = test.collaborators?.some((t) => t.id === userId);
	const canEdit = isCreator || isCollaborator;

	const handleCopyLink = () => {
		navigator.clipboard
			.writeText(`${window.location.host}/solve/${test.id}`)
			.then(() => {
				toast({
					description: "📋 Copied link to clipboard.",
				});
			})
			.catch(() => {
				toast({
					description: "📋 Failed to copy link to clipboard.",
					variant: "destructive",
				});
			});
	};

	const handleEdit = () => {
		navigate(`/create/${test.id}`);
	};

	const handleStart = () => {
		navigate(`/solve/${test.id}`);
	};

	const handleDeleteBookmark = async () => {
		await deleteBookmarkedTest(userId!, test.id)
			.then(() => {
				toast({
					title: "✅ Bookmark deleted successfully",
				});
				queryClient.setQueryData(["bookmarked", userId], (oldData: TestType[] | undefined) => {
					if (!oldData) {
						return oldData;
					}

					const newData = oldData.filter((t) => t.id !== test.id);

					return newData;
				});
			})
			.catch(() => {
				toast({
					title: "😓 Failed to delete bookmark",
					variant: "destructive",
				});
			});
	};

	return (
		<div className="flex flex-col items-center justify-between w-full gap-5 px-5 py-3 border rounded-sm sm:flex-row border-slate-200 dark:border-gray-800">
			<div className="flex flex-row items-start w-full gap-3 ">
				<div className="flex -space-x-5">
					<Avatar>
						<AvatarImage
							src={test.author?.imageUrl}
							className="inline-block border-2 border-white rounded-full dark:border-gray-950"
						/>
						<AvatarFallback>
							<Spinner />
						</AvatarFallback>
					</Avatar>

					{test.collaborators &&
						test.collaborators.map(
							(collaborator, index) =>
								index <= 2 && (
									<Avatar key={index}>
										<AvatarImage
											src={collaborator.imageUrl}
											className="inline-block border-2 border-white rounded-full dark:border-gray-950"
										/>
										<AvatarFallback>
											<Spinner />
										</AvatarFallback>
									</Avatar>
								)
						)}
				</div>

				<div className="flex flex-col">
					<h2 className="font-medium break-all text-zinc-800 dark:text-white">{test.title}</h2>
					<p className="text-xs text-slate-400">
						{test.updatedAt
							? `Last updated: ${getTimeAgo(test.updatedAt)}`
							: `Created: ${getTimeAgo(test.createdAt)}`}
					</p>
				</div>
			</div>
			<div className="flex w-full gap-3 sm:w-auto">
				{isBookmarkPage && (
					<ActionTooltip label="Remove bookmark">
						<Button
							size="sm"
							variant="outline"
							className="flex-1 hover:bg-slate-200"
							onClick={handleDeleteBookmark}
						>
							<TrashIcon className="w-4 h-4" />
						</Button>
					</ActionTooltip>
				)}

				<ActionTooltip label="Copy link">
					<Button
						size="sm"
						variant="outline"
						className="flex-1 hover:bg-slate-200"
						onClick={handleCopyLink}
					>
						<CopyIcon className="w-4 h-4" />
					</Button>
				</ActionTooltip>

				{canEdit && (
					<ActionTooltip label="Edit">
						<Button
							size="sm"
							className="flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
							onClick={handleEdit}
						>
							<EditIcon className="w-4 h-4" />
						</Button>
					</ActionTooltip>
				)}

				<Button
					size="sm"
					className="flex-1 bg-green-600 hover:bg-green-700 dark:hover:bg-green-700"
					onClick={handleStart}
				>
					Start
				</Button>
			</div>
		</div>
	);
};

export default TestItem;
