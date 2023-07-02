import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "./components/ui/toaster.tsx";

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const apperance = {
	variables: {
		colorPrimary: "#3b82f6",
	},
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<ClerkProvider publishableKey={clerkPubKey} appearance={apperance}>
		<Toaster />
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ClerkProvider>
);
