import { TrashIcon } from "lucide-react";

interface Props {
	email: String;
	onDelete: (email: String) => void;
}

const CollaboratorItem = ({ email, onDelete }: Props) => {
	return (
		<>
			<div className=" col-span-9 text-slate-500 p-3 border-t border-slate-200">{email}</div>
			<div className=" col-span-3 text-slate-500 p-3 flex justify-center items-center border-t border-slate-200" onClick={() => onDelete(email)}>
				<TrashIcon className="w-4 h-4 text-zinc-800 hover:text-red-500 cursor-pointer" />
			</div>
		</>
	);
};

export default CollaboratorItem;
