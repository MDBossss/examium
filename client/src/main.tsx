import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<ClerkProvider publishableKey={clerkPubKey}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ClerkProvider>
);
