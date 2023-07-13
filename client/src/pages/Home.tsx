import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/Button";
import Footer from "../components/Footer";

const Home = () => {
	const navigate = useNavigate();

	return (
		<div className="w-screen h-screen mesh-home">
			<div className="flex flex-col h-full gap-2 container max-w-7xl mx-auto">
				<Navbar />
				<div className="flex flex-col text-center max-w-lg gap-5 items-center m-auto pb-32">
					<h1 className="text-5xl font-extrabold text-zinc-800">
						Your{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-600">
							Knowledge
						</span>{" "}
						Expands Here
					</h1>
					<p className="text-zinc-800 text-sm p-2">
						Create and collaborate on quizzes - the ultimate learning method.
					</p>
					<div>
						<Button
							className="p-4 bg-blue-500 hover:bg-blue-600"
							onClick={() => navigate("/create")}
						>
							Get started
						</Button>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Home;
