import { useSession } from "@clerk/clerk-react";
import LoginButton from "./ui/LoginButton";
import { TestType } from "../types/models";
import { ChevronLeftIcon, ChevronRightIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSidebarStore } from "../store/sidebarStore";

interface Props {
	setTest?: (test: TestType) => void;
	test?: TestType;
}

const SearchBar = ({ test, setTest }: Props) => {
	const { showSidebar, toggleSidebar } = useSidebarStore();
	const { session } = useSession();
	const navigate = useNavigate();
	const date = new Date();

	const handleNext = () => {
		navigate(-1);
	};

	const handlePrevious = () => {
		navigate(+1);
	};

	const handleToggleSidebar = () => {
		toggleSidebar();
	};

	return (
		<div className="flex flex-row gap-3 items-center justify-between">
			<div className="flex gap-2 items-center">
				{showSidebar ? (
					<PanelLeftCloseIcon
						className="w-6 h-6 text-slate-400 cursor-pointer hover:bg-slate-200 rounded-sm"
						onClick={handleToggleSidebar}
					/>
				) : (
					<PanelLeftOpenIcon
						className="w-6 h-6 text-slate-400 cursor-pointer hover:bg-slate-200 rounded-sm"
						onClick={handleToggleSidebar}
					/>
				)}

				<ChevronLeftIcon
					className="w-6 h-6 text-slate-400 cursor-pointer hover:bg-slate-200 rounded-sm"
					onClick={handleNext}
				/>
				<ChevronRightIcon
					className="w-6 h-6 text-slate-400 cursor-pointer hover:bg-slate-200 rounded-sm"
					onClick={handlePrevious}
				/>
				<p className="text-sm text-slate-400">
					{date.toLocaleDateString(undefined, {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</p>
			</div>
			<div className="flex gap-3 items-center">
				{session && (
					<p>
						Welcome, <span className=" text-blue-500">{session.user.firstName}</span>
					</p>
				)}
				<LoginButton test={test} setTest={setTest} />
			</div>
		</div>
	);
};

export default SearchBar;
