import { TrashIcon } from "lucide-react";

interface Props {
	email: String;
	onDelete: (email: String) => void;
}

const CollaboratorItem = ({ email, onDelete }: Props) => {
	return (
		<>
			<div className="col-span-9 p-3 border-t text-slate-500 border-slate-200 dark:border-slate-600">
				{email}
			</div>
			<div
				className="flex items-center justify-center col-span-3 p-3 border-t text-slate-500 border-slate-200 dark:border-slate-600"
				onClick={() => onDelete(email)}
			>
				<TrashIcon className="w-4 h-4 cursor-pointer text-zinc-800 hover:text-red-500" />
			</div>
		</>
	);
};

export default CollaboratorItem;
