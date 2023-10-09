import { useClerk, useSession } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./Dropdown";
import { Button } from "./Button";
import {
	CalendarIcon,
	FileIcon,
	LaptopIcon,
	LogOutIcon,
	MoonIcon,
	PaletteIcon,
	PlusIcon,
	SunIcon,
	UserIcon,
	UsersIcon,
} from "lucide-react";
import ProgressDialog from "./Dialogs/ProgressDialog";
import useNavigationDialog from "../../hooks/useNavigationDialog";
import { useLocation, useNavigate } from "react-router-dom";
import { TestType } from "../../types/models";
import { useToast } from "../../hooks/useToast";
import { useEffect, useState } from "react";
import useGenerateData from "../../hooks/useGenerateData";
import { createUser, fetchUserById } from "../../api/users";
import Spinner from "./Spinner";
import ProfileDialog from "./Dialogs/ProfileDialog";
import { useThemeStore } from "../../store/themeStore";

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
	const {clearTheme,setTheme} = useThemeStore();

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

	const handleToggleProfile = (value: boolean) => {
		if (value == true) {
			setShowProfileDialog(value);
			document.body.style.overflow = "hidden";
		} else {
			setShowProfileDialog(value);
			document.body.style.overflow = "";
		}
	};

	const handleLogout = async () => {
		await signOut();
		session?.end;
		setUserChecked(false);
		sessionStorage.removeItem("test");
		navigate("/");
		toast({
			title: "👋 Successfully logged out.",
		});
	};

	const handleSignIn = () => {
		if (test) {
			sessionStorage.setItem("test", JSON.stringify(test));
		}
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
					<DropdownMenuContent className="">
						
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="flex gap-1" onClick={() => handleToggleProfile(true)}>
							<UserIcon className="w-4 h-4" /> Profile
						</DropdownMenuItem>
						<DropdownMenuItem className="flex gap-1" onClick={() => handleNavigate("/create")}>
							<PlusIcon className="w-4 h-4" /> New test
						</DropdownMenuItem>
						<DropdownMenuItem
							className="flex gap-1"
							onClick={() => handleNavigate(`/tests/${session.user.id}`)}
						>
							<FileIcon className="w-4 h-4" /> My tests
						</DropdownMenuItem>
						<DropdownMenuItem
							className="flex gap-1"
							onClick={() => handleNavigate(`/collaborations/${session.user.id}`)}
						>
							<UsersIcon className="w-4 h-4" /> Collaborations
						</DropdownMenuItem>
						<DropdownMenuItem
							className="flex gap-1"
							onClick={() => handleNavigate(`/schedule/${session.user.id}`)}
						>
							<CalendarIcon className="w-4 h-4" /> Schedule
						</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger className="flex gap-1">
								<PaletteIcon  className="w-4 h-4" />
								<span>Theme</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem className="flex gap-1" onClick={() => setTheme("light")}>
										<SunIcon className="w-4 h-4" />
										<span>Light</span>
									</DropdownMenuItem>
									<DropdownMenuItem className="flex gap-1"  onClick={() => setTheme("dark")}>
										<MoonIcon className="w-4 h-4" />
										<span>Dark</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem className="flex gap-1" onClick={() => clearTheme()}>
										<LaptopIcon className="w-4 h-4" />
										<span>System</span>
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
						<DropdownMenuItem className="flex gap-1" onClick={handleLogout}>
							<LogOutIcon className="w-4 h-4" /> Logout
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
