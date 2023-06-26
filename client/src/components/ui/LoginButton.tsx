import { useClerk, useSession } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./dropdown";
import { Button } from "./button";
import { FileIcon, LogOutIcon, PlusIcon, UserIcon, UsersIcon } from "lucide-react";
import ProgressDialog from "./ProgressDialog";
import useNavigationDialog from "../../hooks/useNavigationDialog";
import { useLocation } from "react-router-dom";
import { TestType } from "../../types/models";
import { useEffect } from "react";

interface Props{
	setTest: (test:TestType) => void;
	test: TestType
}

const LoginButton = ({test,setTest}:Props) => {
	const location = useLocation();
	const { session } = useSession();
	const { openSignIn, signOut } = useClerk();
	const { showDialog, setShowDialog, handleNavigate, handleContinue } = useNavigationDialog();

	const handleLogout = async () => {
		await signOut();
		session?.end;
	};

	const handleSignIn = () => {
		sessionStorage.setItem("test",JSON.stringify(test));
		openSignIn({redirectUrl:location.pathname})
	}

	useEffect(() => {
		const testJSON = sessionStorage.getItem("test")
		if(testJSON){
			let test: TestType = JSON.parse(testJSON)
			setTest(test)
			sessionStorage.removeItem("test");
		}
	},[])

	return (
		<>
			{showDialog && (
				<ProgressDialog
					onContinue={() => handleContinue()}
					onCancel={() => setShowDialog(false)}
					dialogOpen={showDialog}
				/>
			)}
			{session?.user ? (
				<DropdownMenu>
					<DropdownMenuTrigger className="outline-none">
						<Avatar className="cursor-pointer ">
							<AvatarImage src={session.user.imageUrl} />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="bg-primary">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="flex gap-1" onClick={() => handleNavigate("/profile")}>
							<UserIcon className="h-4 w-4" /> Profile
						</DropdownMenuItem>
						<DropdownMenuItem className="flex gap-1" onClick={() => handleNavigate("/create")}>
							<PlusIcon className="h-4 w-4" /> New test
						</DropdownMenuItem>
						<DropdownMenuItem className="flex gap-1" onClick={() => handleNavigate("/tests:id")}>
							<FileIcon className="h-4 w-4" /> My tests
						</DropdownMenuItem>
						<DropdownMenuItem
							className="flex gap-1"
							onClick={() => handleNavigate("/collaborations")}
						>
							<UsersIcon className="h-4 w-4" /> Collaborations
						</DropdownMenuItem>
						<DropdownMenuItem className="flex gap-1" onClick={handleLogout}>
							<LogOutIcon className="h-4 w-4" /> Logout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<Button variant="outline" onClick={handleSignIn}>
					Login
				</Button>
			)}
		</>
	);
};

export default LoginButton;
