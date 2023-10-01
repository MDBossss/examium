import { PlusIcon, FileIcon, UsersIcon, EditIcon, LockIcon, CalendarIcon } from "lucide-react";
import { Button } from "./ui/Button";
import { useLocation, useNavigate } from "react-router-dom";
import ProgressDialog from "./ui/Dialogs/ProgressDialog";
import useNavigationDialog from "../hooks/useNavigationDialog";
import Logo from "./ui/Logo";
import { useSession } from "@clerk/clerk-react";

const Navbar = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { session } = useSession();
	const { showDialog, setShowDialog, handleNavigate, handleContinue } = useNavigationDialog();

	const navItems = [
		{
			location: `/tests/${session?.user.id}`,
			title: "My Tests",
			icon: <FileIcon className="w-4 h-4" />,
		},
		{
			location: `/collaborations/${session?.user.id}`,
			title: "Collaborations",
			icon: <UsersIcon className="w-4 h-4" />,
		},
		{
			location: `/schedule`,
			title: "Schedule",
			icon: <CalendarIcon className="w-4 h-4" />,
		},
	];

	const handlePreviewTest = () => {
		window.scrollTo({
			top: document.documentElement.scrollHeight,
			behavior: "smooth",
		});
	};

	const handleBack = () => {
		if (location.pathname === "/create/preview") {
			navigate(-1);
		} else if (location.pathname === "/create/preview/results") {
			navigate(-2);
		}
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
			<div className="flex-col justify-between min-w-[204px] h-screen hidden md:flex">
				<div className="fixed flex flex-col justify-between h-screen p-3 bg-slate-200 dark:bg-gray-900">
					<div className="flex flex-col h-full gap-5">
						<div
							className="flex items-center gap-1 text-xl cursor-pointer"
							onClick={() => handleNavigate("/")}
						>
							<Logo />
						</div>

						{location.pathname === "/create/preview" ||
						location.pathname === "/create/preview/results" ? (
							<Button
								className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
								onClick={() => handleBack()}
							>
								Back to editor <EditIcon className="w-5 h-5" />
							</Button>
						) : null}

						<Button
							className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
							onClick={() => handleNavigate("/create")}
						>
							New test <PlusIcon className="w-6 h-6" />
						</Button>
						{session?.user ? (
							<div className="h-full">
								<h4 className="text-sm border-b border-gray-300 ">Menu</h4>
								<ul className="flex flex-col gap-1 py-2 text-md">
									{navItems.map((item) => (
										<li key={item.title}>
											<div
												className="flex items-center gap-3 p-1 text-lg transition-all rounded-sm cursor-pointer hover:bg-slate-300 dark:hover:bg-gray-800"
												onClick={() => handleNavigate(item.location)}
											>
												{item.icon}
												{item.title}
											</div>
										</li>
									))}
								</ul>
							</div>
						) : (
							<div className="flex flex-col items-center gap-2 p-5 my-auto">
								<LockIcon className="w-10 h-10 text-slate-400" />
								<p className="text-sm text-center text-slate-400">
									<span className="font-bold">Login</span> to access
									<br /> all features.
								</p>
							</div>
						)}
					</div>
					{location.pathname.startsWith("/create") && location.pathname !== "/create/preview" && (
						<div className="flex">
							<Button
								className="flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
								onClick={handlePreviewTest}
							>
								Preview test
							</Button>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Navbar;
