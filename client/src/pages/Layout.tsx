import { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import UserNavbar from "../components/UserNavbar";
import { useLocation } from "react-router-dom";
import { useSidebar } from "../components/SidebarProvider";

const sidebarBlacklist: string[] = ["/solve","/results"];

interface Props {
	children: ReactNode;
	className?: string
}

const Layout = ({ children,className }: Props) => {
	const location = useLocation();
	const { showSidebar } = useSidebar();

	const isPathInBlacklist = sidebarBlacklist.some((path) => location.pathname.includes(path));
	
	return (
		<div className="flex">
			{showSidebar && !isPathInBlacklist && <Sidebar />}
			<main className={`${className} flex flex-col w-full gap-10 p-4 pt-5 max-w-screen sm:p-10`}>
				<UserNavbar />
				{children}
			</main>
		</div>
	);
};

export default Layout;
