import { Button } from "../Button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./AlertDialog";

interface Props {
	onTrigger: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const DeleteGroupDialog = ({ onTrigger }: Props) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline" className="text-red-600 !border-red-600 hover:text-red-600">
					Delete group
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will delete the group and all its contents.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={(e) => onTrigger(e)}>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteGroupDialog;
