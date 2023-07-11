import { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import { useSidebarStore } from "../store/sidebarStore";

interface Props {
	children: ReactNode;
}

const Layout = ({ children }: Props) => {
	const {showSidebar} = useSidebarStore()

	return (
		<div className="flex ">
			{showSidebar && <Sidebar />}
			{children}
		</div>
	);
};

export default Layout;
