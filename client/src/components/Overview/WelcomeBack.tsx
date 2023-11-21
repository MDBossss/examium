import { useState } from "react";
import { getRandomItemFromArray } from "../../utils/genericUtils";
import { ActiveSessionResource } from "@clerk/types";
import { BrushIcon } from "lucide-react";

const colors: string[] = [
	"!bg-amber-600",
	"!bg-red-700",
	"!bg-emerald-700",
	"!bg-blue-700",
	"!bg-purple-800",
	"!bg-pink-700",
];

interface Props {
	session: ActiveSessionResource | null | undefined;
}

const WelcomeBack = ({ session }: Props) => {
	const [randomColor, setRandomColor] = useState<string | null>(getRandomItemFromArray(colors));

	return (
		<div className="flex flex-col p-2 border rounded-sm border-slate-200 dark:border-gray-800">
			<div
				className={`${randomColor} bg-doodle-light bg-opacity-10 flex flex-col justify-between gap-10 p-8 rounded-sm sm:bg-welcome-back text-slate-200`}
			>
				<div className="flex flex-col gap-3 ">
					<h2 className="font-bold tracking-wider">Welcome Back 👋</h2>
					<h1 className="text-5xl font-medium text">{session?.user.fullName}</h1>
				</div>
				<div className="flex items-center gap-1">
					<p
						className={`${randomColor} text-sm cursor-pointer hover:underline`}
						onClick={() => setRandomColor(getRandomItemFromArray(colors))}
					>
						Be creative today!{" "}
					</p>
					<BrushIcon className="w-4 h-4" />
				</div>
			</div>
		</div>
	);
};

export default WelcomeBack;
