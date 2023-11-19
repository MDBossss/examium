import { useSession } from "@clerk/clerk-react";
import LoginButton from "./ui/LoginButton";
import { TestType } from "../../../shared/models";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PanelLeftCloseIcon,
	PanelLeftOpenIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSidebarStore } from "../store/sidebarStore";
import PomodoroButton from "./PomodoroButton";
import { ActionTooltip } from "./ui/ActionTooltip";

interface Props {
	setTest?: (test: TestType) => void;
	test?: TestType;
}

const UserNavbar = ({ test, setTest }: Props) => {
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
		<nav className="flex flex-row items-center justify-between gap-3">
			<div className="flex items-center gap-2">
				{!location.pathname.startsWith("/solve") && (
					<>
						{showSidebar ? (
							<ActionTooltip label="Hide sidebar">
								<PanelLeftCloseIcon
									className="hidden w-6 h-6 rounded-sm cursor-pointer text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-800 md:block"
									onClick={handleToggleSidebar}
								/>
							</ActionTooltip>
						) : (
							<ActionTooltip label="Show Sidebar">
								<PanelLeftOpenIcon
									className="hidden w-6 h-6 rounded-sm cursor-pointer text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-800 md:block"
									onClick={handleToggleSidebar}
								/>
							</ActionTooltip>
						)}

						<ActionTooltip label="Go back">
							<ChevronLeftIcon
								className="w-6 h-6 rounded-sm cursor-pointer text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-800"
								onClick={handleNext}
							/>
						</ActionTooltip>

						<ActionTooltip label="Go forward">
							<ChevronRightIcon
								className="w-6 h-6 rounded-sm cursor-pointer text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-800"
								onClick={handlePrevious}
							/>
						</ActionTooltip>
					</>
				)}

				<p className="hidden text-sm text-slate-400 sm:block">
					{date.toLocaleDateString(undefined, {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</p>
				<PomodoroButton />
			</div>
			<div className="flex items-center gap-3">
				{session && (
					<p className="hidden md:block">
						Welcome, <span className="text-blue-500 ">{session.user.firstName}</span>
					</p>
				)}
				<LoginButton test={test} setTest={setTest} />
			</div>
		</nav>
	);
};

export default UserNavbar;
