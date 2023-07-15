import { useSession } from "@clerk/clerk-react";
import LoginButton from "./ui/LoginButton";
import { TestType } from "../types/models";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PanelLeftCloseIcon,
	PanelLeftOpenIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSidebarStore } from "../store/sidebarStore";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip";

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
				{!location.pathname.startsWith("/solve") && (
					<>
						{showSidebar ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<PanelLeftCloseIcon
										className=" w-6 h-6 text-slate-400 cursor-pointer hover:bg-slate-200 rounded-sm hidden md:block"
										onClick={handleToggleSidebar}
									/>
								</TooltipTrigger>
								<TooltipContent>
									<p>Hide Sidebar</p>
								</TooltipContent>
							</Tooltip>
						) : (
							<Tooltip>
								<TooltipTrigger asChild>
									<PanelLeftOpenIcon
										className="w-6 h-6 text-slate-400 cursor-pointer hover:bg-slate-200 rounded-sm hidden md:block"
										onClick={handleToggleSidebar}
									/>
								</TooltipTrigger>
								<TooltipContent>
									<p>Show Sidebar</p>
								</TooltipContent>
							</Tooltip>
						)}

						<Tooltip>
							<TooltipTrigger asChild>
								<ChevronLeftIcon
									className="w-6 h-6 text-slate-400 cursor-pointer hover:bg-slate-200 rounded-sm"
									onClick={handleNext}
								/>
							</TooltipTrigger>
							<TooltipContent>
								<p>Go Back</p>
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<ChevronRightIcon
									className="w-6 h-6 text-slate-400 cursor-pointer hover:bg-slate-200 rounded-sm"
									onClick={handlePrevious}
								/>
							</TooltipTrigger>
							<TooltipContent>
								<p>Go Forward</p>
							</TooltipContent>
						</Tooltip>
					</>
				)}

				<p className="text-sm text-slate-400 hidden sm:block">
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
					<p className="hidden md:block">
						Welcome, <span className=" text-blue-500">{session.user.firstName}</span>
					</p>
				)}
				<LoginButton test={test} setTest={setTest} />
			</div>
		</div>
	);
};

export default SearchBar;
