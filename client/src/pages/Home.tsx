import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/Button";

const Home = () => {
	const navigate = useNavigate();

	return (
		<>
			<div className="flex flex-col gap-24 container max-w-7xl mx-auto">
				<Navbar />
				<div className="flex gap-10 items-center mt-32">
					<div className="w-3/5 flex flex-col gap-5 flex-1">
						<h1 className="text-6xl font-extrabold text-zinc-800">
							Your{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-600">
								Knowledge
							</span>{" "}
							expands here.
						</h1>
						<p className="text-zinc-800 text-sm p-2">
							With Examium, studying becomes an engaging and interactive journey. Say goodbye to dry
							textbooks and endless note-taking, and say hello to an exciting world of quizzes
							designed to challenge and sharpen your knowledge.{" "}
						</p>
						<div>
							<Button
								className="p-6 bg-blue-500 hover:bg-blue-600"
								onClick={() => navigate("/create")}
							>
								Get started
							</Button>
						</div>
					</div>
					<div className="p-10 w-1/2 flex-1">
						<img className="w-full" src="/hero.svg" alt="" />
					</div>
				</div>
			</div>
			<div className="w-full bg-blue-500 mt-20">
				<p className="text-center text-white font-bold p-5 items-center text-sm">
					Examium provides one of the best study methods - quizzes.
				</p>
			</div>
		</>
	);
};

export default Home;
