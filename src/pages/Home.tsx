import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";

const Home = () => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col gap-24 container max-w-7xl mx-auto">
			<Navbar />
			<div className="mt-32 w-3/5 flex flex-col gap-5">
				<h1 className="text-6xl font-extrabold text-zinc-800">
					Expanding your{" "}
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-600">
						knowledge
					</span>{" "}
					starts here.
				</h1>
				<p className="text-zinc-800 text-sm">
					With Examium, studying becomes an engaging and interactive journey. Say goodbye to dry
					textbooks and endless note-taking, and say hello to an exciting world of quizzes designed
					to challenge and sharpen your knowledge.{" "}
				</p>
				<div>
					<Button
						className="p-6 mt-5 bg-blue-500 hover:bg-blue-700"
						onClick={() => navigate("/create")}
					>
						Get started
					</Button>
				</div>
			</div>
			<div className="flex flex-col">
				<p className="text-center text-zinc-800 text-sm">
					Examium is provides one of the best study methods - quizzes
				</p>
			</div>
		</div>
	);
};

export default Home;
