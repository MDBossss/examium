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

interface Props{
    onTrigger: () => void,
	hasParamId: boolean
}

const ResetDialog = ({onTrigger,hasParamId}:Props) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium text-white transition-colors bg-red-500 rounded-md hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 dark:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background">
				{hasParamId ? "Delete" : "Reset"}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will delete the test and all progress will be lost.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={onTrigger}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default ResetDialog;
