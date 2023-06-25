import { DocumentIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { DocumentChartBarIcon } from "@heroicons/react/20/solid";
import { Button } from "./ui/button";
import { useNavigate, useLocation} from "react-router-dom";
import { useState } from "react";
import ProgressDialog from "./ui/ProgressDialog";

const Navbar = () => {
	const [showHomeDialog, setShowHomeDialog] = useState<boolean>(false);
  const [route,setRoute] = useState<string>("");
	const navigate = useNavigate();
	const location = useLocation();

	if (location.pathname === "/") {
		return null;
	}

	const handleNavigate = (path: string) => {
		if (location.pathname === "/create" && path !== location.pathname) {
			setShowHomeDialog(true);
      setRoute(path)
		} else {
			navigate(path);
      setRoute("")
		}
	};

	const handleContinue = () => {
    let tempRoute = route;
    setRoute("")
		setShowHomeDialog(false);
		navigate(tempRoute);
	};

	return (
		<>
			{showHomeDialog && (
				<ProgressDialog
					onContinue={() => handleContinue()}
					onCancel={() => setShowHomeDialog(false)}
					dialogOpen={showHomeDialog}
				/>
			)}
			<div className="p-3 flex flex-col gap-10 w-52 bg-slate-200 h-screen fixed">
				<div
					className="flex gap-1 items-center text-xl cursor-pointer"
					onClick={() => handleNavigate("/")}
				>
					<DocumentIcon className="h-7 w-7 text-blue-500" />
					<h1 className=" font-medium text-2xl text-zinc-800 font-sans tracking-tight">Examium</h1>
				</div>
				<Button
					className="bg-blue-500 hover:bg-blue-600 flex gap-2"
					onClick={() => handleNavigate("/create")}
				>
					New test <PlusCircleIcon className="w-6 h-6" />
				</Button>
				<div>
					<h4 className="font-medium text-md border-gray-300 border-b-2">Menu</h4>
					<ul className="p-2 text-md flex flex-col gap-2">
						<li>
							<div className="flex gap-1 cursor-pointer" onClick={() => handleNavigate("/tests/:id")}>
								<DocumentChartBarIcon className="w-6 h-6" />
								My tests
							</div>
						</li>
						<li>
							<div className="cursor-pointer" onClick={() => handleNavigate("/collaborations")}>Collaborate</div>
						</li>
					</ul>
				</div>
			</div>
		</>
	);
};

export default Navbar;
