import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const useNavigationDialog = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [showDialog, setShowDialog] = useState(false);
	const [route, setRoute] = useState("");

	const handleNavigate = (path: string) => {
		if (location.pathname.startsWith("/create") && path !== location.pathname) {
			setShowDialog(true);
			setRoute(path);
		} else {
			navigate(path);
			setRoute("");
		}
	};

	const handleContinue = () => {
		let tempRoute = route;
		setRoute("");
		setShowDialog(false);
		navigate(tempRoute);
	};

	return { showDialog, handleNavigate, handleContinue, setShowDialog };
};

export default useNavigationDialog;
