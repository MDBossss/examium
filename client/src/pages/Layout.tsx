import { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import { useSidebarStore } from "../store/sidebarStore";
import SearchBar from "../components/SearchBar";
import { useLocation } from "react-router-dom";

const sidebarBlacklist: string[] = ["/solve","/results"];

interface Props {
	children: ReactNode;
}

const Layout = ({ children }: Props) => {
	const location = useLocation();
	const { showSidebar } = useSidebarStore();

	const isPathInBlacklist = sidebarBlacklist.some((path) => location.pathname.includes(path));
	
	return (
		<div className="flex ">
			{showSidebar && !isPathInBlacklist && <Sidebar />}
			<div className="flex flex-col w-full gap-10 p-4 pt-5 max-w-screen sm:p-10">
				<SearchBar />
				{children}
			</div>
		</div>
	);
};

export default Layout;
