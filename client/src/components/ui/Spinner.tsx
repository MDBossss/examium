import { cn } from "../../lib/utils";

interface Props{
	className?: string
}

const Spinner = ({className}:Props) => {
	return (
		<div className={cn(`${className} w-full flex justify-center`)}>
			<div
				className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-500 rounded-full"
				role="status"
				aria-label="loading"
			>
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	);
};

export default Spinner;
