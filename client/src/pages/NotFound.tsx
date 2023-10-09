import { useNavigate } from "react-router-dom";

const NotFound404 = () => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col max-w-2xl gap-10 p-20 mx-auto">
			<img className="self-center w-full" src="/page_not_found.svg" alt="not found" />
			<h1 className="self-center">
				How did you end up here?{" "}
				<span className="underline cursor-pointer" onClick={() => navigate("/")}>
					{" "}
					Return to the <span className="font-bold">Homepage.</span>
				</span>
			</h1>
		</div>
	);
};

export default NotFound404;
