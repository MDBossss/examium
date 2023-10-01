import { useSession } from "@clerk/clerk-react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Props {
	children: ReactNode;
}

const RouteGuard = ({ children }: Props) => {
	const { session } = useSession();

	if (!session?.user) {
		return <Navigate to="/" replace/>;
	}

	return <>{children}</>;
};

export default RouteGuard;
