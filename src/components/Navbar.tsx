import { DocumentIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const Navbar = () => {
	const navigate = useNavigate();

	return (
		<div className="fixed top-0 inset-x-0 h-fit bg-primary ">
			<div className="max-w-7xl mx-auto flex justify-between items-center p-3">
				<div
					className="flex gap-1 items-center text-xl cursor-pointer"
					onClick={() => navigate("/")}
				>
					<DocumentIcon className="h-7 w-7 mb-2 text-blue-500" />
					<h1 className=" font-medium text-2xl text-zinc-800 font-sans tracking-tight mb-1">Examium</h1>
				</div>
				<div className="flex gap-3">
          <Button variant="ghost">Login</Button>
          <Button variant="outline" onClick={() => navigate("/create")}>Get started</Button>
        </div>
			</div>
		</div>
	);
};

export default Navbar;
