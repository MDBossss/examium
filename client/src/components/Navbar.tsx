import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import LoginButton from "./ui/LoginButton";
import Logo from "./ui/Logo";

const Navbar = () => {
	const navigate = useNavigate();

	return (
		<div>
			<div className="flex items-center justify-between p-0 mx-auto max-w-7xl">
				<div
					className="flex items-center gap-1 text-xl cursor-pointer"
					onClick={() => navigate("/")}
				>
					<Logo />
				</div>
				<div className="flex flex-row-reverse gap-3">
					<LoginButton />
					<Button className="hidden bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 sm:block" onClick={() => navigate("/create")}>
						Get started
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
