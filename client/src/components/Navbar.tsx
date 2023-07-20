import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import LoginButton from "./ui/LoginButton";
import Logo from "./ui/logo";

const Navbar = () => {
	const navigate = useNavigate();

	return (
		<div>
			<div className="max-w-7xl mx-auto flex justify-between items-center p-0">
				<div
					className="flex gap-1 items-center text-xl cursor-pointer"
					onClick={() => navigate("/")}
				>
					<Logo />
				</div>
				<div className="flex flex-row-reverse gap-3">
					<LoginButton />
					<Button className="bg-blue-500 hover:bg-blue-600 hidden sm:block" onClick={() => navigate("/create")}>
						Get started
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
