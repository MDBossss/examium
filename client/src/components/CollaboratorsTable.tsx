import CollaboratorItem from "./CollaboratorItem";

interface Props {
	collaborators: String[] | undefined;
	onDelete: (email: String) => void;
}

const CollaboratorsTable = ({ collaborators, onDelete }: Props) => {
	return (
		<div className="flex flex-col text-sm border rounded-sm border-slate-200 dark:border-gray-600">
			<div className="grid grid-cols-12">
				<div className="col-span-12 p-3 font-bold text-slate-500">Email</div>
				{!collaborators && (
					<p className="col-span-12 p-3 italic text-center border-t border-slate-200 dark:border-gray-600 text-slate-400">
						Empty
					</p>
				)}
				{collaborators?.map((collaborator) => (
					<CollaboratorItem
						key={collaborator.toString()}
						email={collaborator}
						onDelete={onDelete}
					/>
				))}
			</div>
		</div>
	);
};

export default CollaboratorsTable;
