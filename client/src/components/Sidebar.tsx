import { PlusIcon, FileIcon, UserIcon, UsersIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useLocation } from "react-router-dom";
import ProgressDialog from "./ui/ProgressDialog";
import useNavigationDialog from "../hooks/useNavigationDialog";
import Logo from "./ui/logo";

const Navbar = () => {
	const location = useLocation();
	const { showDialog, setShowDialog, handleNavigate, handleContinue } = useNavigationDialog();

	if (location.pathname === "/") {
		return null;
	}

	return (
		<>
			{showDialog && (
				<ProgressDialog
					onContinue={() => handleContinue()}
					onCancel={() => setShowDialog(false)}
					dialogOpen={showDialog}
				/>
			)}
			<div className="p-3 flex flex-col justify-between gap-10 w-52 bg-slate-200 h-screen fixed">
				<div className="flex flex-col gap-5">
					<div
						className="flex gap-1 items-center text-xl cursor-pointer"
						onClick={() => handleNavigate("/")}
					>
						<Logo />
					</div>
					<Button
						className="bg-blue-500 hover:bg-blue-600 flex gap-2"
						onClick={() => handleNavigate("/create")}
					>
						New test <PlusIcon className="w-6 h-6" />
					</Button>
					<div>
						<h4 className="font-medium text-md border-gray-300 border-b-2">Menu</h4>
						<ul className="p-2 text-md flex flex-col gap-1">
							<li>
								<div
									className="flex items-center gap-1 cursor-pointer p-1 rounded-sm transition-all hover:bg-slate-300"
									onClick={() => handleNavigate("/tests/:id")}
								>
									<FileIcon className="w-5 h-5" />
									My tests
								</div>
							</li>
							<li>
								<div
									className="flex items-center gap-1 cursor-pointer p-1 rounded-sm transition-all hover:bg-slate-300"
									onClick={() => handleNavigate("/collaborations")}
								>
									<UsersIcon className="w-5 h-5" />
									Collaborations
								</div>
							</li>
							<li>
								<div
									className="flex items-center gap-1 cursor-pointer p-1 rounded-sm transition-all hover:bg-slate-300"
									onClick={() => handleNavigate("/profile")}
								>
									<UserIcon className="w-5 h-5" />
									Profile
								</div>
							</li>
						</ul>
					</div>
				</div>
				{location.pathname === "/create" && (
					<div className="flex">
						<Button className="bg-blue-500 hover:bg-blue-600 flex-1">Preview test</Button>
					</div>
				)}
			</div>
		</>
	);
};

export default Navbar;
