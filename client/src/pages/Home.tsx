import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/Button";
import Footer from "../components/Footer";
import { useThemeStore } from "../store/themeStore";
import { useSession } from "@clerk/clerk-react";

const Home = () => {
	const {session} = useSession();
	const navigate = useNavigate();
	const { theme } = useThemeStore();
	

	return (
		<section
			className={`w-screen h-screen ${theme === "light" ? "bg-doodle-light" : "bg-doodle-dark"}`}
		>
			<div className="flex flex-col h-full gap-48 p-4 mx-auto sm:pt-2 sm:p-10 max-w-7xl">
				<Navbar />
				<div className="flex flex-col items-center w-full max-w-lg gap-5 mx-auto text-center">
					<h1 className="text-5xl font-extrabold text-zinc-800 dark:text-slate-200">
						Your{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-600">
							Knowledge
						</span>{" "}
						Expands Here
					</h1>
					<p className="p-2 text-sm font-medium text-zinc-800 dark:text-slate-200">
						Create and collaborate on quizzes - the ultimate learning method.
					</p>
					<div>
						<Button
							className="px-6 py-6 text-xl font-bold bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
							onClick={() => session?.user.id ? navigate(`overview/${session.user.id}`) : navigate("/create")}
							size={"lg"}
						>
							Get started
						</Button>
					</div>
				</div>
			</div>
			<Footer />
		</section>
	);
};

export default Home;
