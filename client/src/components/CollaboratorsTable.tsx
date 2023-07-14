import CollaboratorItem from "./CollaboratorItem";

interface Props {
	collaborators: String[] | undefined,
    onDelete: (email:String) => void
}

const CollaboratorsTable = ({ collaborators,onDelete }: Props) => {
	return (
		<div className="flex flex-col border border-slate-200 rounded-sm text-sm">
			<div className="grid grid-cols-12">
				<div className=" col-span-12 font-bold text-slate-500 p-3">Email</div>
				{collaborators?.map((collaborator) => (
					<CollaboratorItem key={collaborator.toString()} email={collaborator} onDelete={onDelete} />
				))}
			</div>
		</div>
	);
};

export default CollaboratorsTable;
