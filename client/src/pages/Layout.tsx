import { ReactNode } from "react";
import Sidebar from "../components/Sidebar";

interface Props {
	children: ReactNode;
}

const Layout = ({ children }: Props) => {
	return (
		<div className="flex ">
			<Sidebar />
			{children}
		</div>
	);
};

export default Layout;
