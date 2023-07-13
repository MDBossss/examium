import { useClerk, useSession } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./Dropdown";
import { Button } from "./Button";
import { FileIcon, LogOutIcon, PlusIcon, UserIcon, UsersIcon } from "lucide-react";
import ProgressDialog from "./Dialogs/ProgressDialog";
import useNavigationDialog from "../../hooks/useNavigationDialog";
import { useLocation, useNavigate } from "react-router-dom";
import { TestType } from "../../types/models";
import { useToast } from "../../hooks/useToast";
import { useEffect, useState } from "react";
import useGenerateData from "../../hooks/useGenerateData";
import { createUser, fetchUserById } from "../../utils/dbUtils";
import Spinner from "./Spinner";
import ProfileDialog from "./Dialogs/ProfileDialog";

interface Props {
	setTest?: (test: TestType) => void;
	test?: TestType;
}

const LoginButton = ({ test }: Props) => {
	const { toast } = useToast();
	const location = useLocation();
	const navigate = useNavigate();
	const { session } = useSession();
	const { generateUser } = useGenerateData();
	const { openSignIn, signOut } = useClerk();
	const [userChecked, setUserChecked] = useState<boolean>(false);
	const [showProfileDialog, setShowProfileDialog] = useState<boolean>(false);
	const { showDialog, setShowDialog, handleNavigate, handleContinue } = useNavigationDialog();

	useEffect(() => {
		const checkUser = async () => {
			if (session && session.user && !userChecked) {
				const user = generateUser(session.user);

				const response = await fetchUserById(user.id);
				if (!response) {
					await createUser(user);
					console.log("added user to db");
				}

				setUserChecked(true);
				//send user to backend and check if exists
				//if not, write user to db
				//when saving the test, put userID from session.user.id
			}
		};
		checkUser();
	}, [session]);

	const handleToggleProfile = (value:boolean) => {
		if(value == true){
			setShowProfileDialog(value);
			document.body.style.overflow = "hidden";
		}
		else{
			setShowProfileDialog(value)
			document.body.style.overflow = "";
		}
	};

	const handleLogout = async () => {
		await signOut();
		session?.end;
		setUserChecked(false);
		sessionStorage.removeItem("test")
		navigate("/");
		toast({
			title: "👋 Successfully logged out.",
		});
	};

	const handleSignIn = () => {
		sessionStorage.setItem("test", JSON.stringify(test));
		openSignIn({ redirectUrl: location.pathname });
	};

	return (
		<>
			{showDialog && (
				<ProgressDialog
					onContinue={() => handleContinue()}
					onCancel={() => setShowDialog(false)}
					dialogOpen={showDialog}
				/>
			)}

			{showProfileDialog && <ProfileDialog handleToggleProfile={handleToggleProfile} />}

			{session?.user ? (
				<DropdownMenu>
					<DropdownMenuTrigger className="outline-none">
						<Avatar className="cursor-pointer ">
							<AvatarImage src={session.user.imageUrl} />
							<AvatarFallback>
								<Spinner />
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="bg-primary">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="flex gap-1" onClick={() => handleToggleProfile(true)}>
							<UserIcon className="h-4 w-4" /> Profile
						</DropdownMenuItem>
						<DropdownMenuItem className="flex gap-1" onClick={() => handleNavigate("/create")}>
							<PlusIcon className="h-4 w-4" /> New test
						</DropdownMenuItem>
						<DropdownMenuItem
							className="flex gap-1"
							onClick={() => handleNavigate(`/tests/${session.user.id}`)}
						>
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
				<Button
					variant="outline"
					className="hover:bg-slate-300 border-slate-300"
					onClick={handleSignIn}
				>
					Login
				</Button>
			)}
		</>
	);
};

export default LoginButton;
