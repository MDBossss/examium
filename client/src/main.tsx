import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "./components/ui/Toaster.tsx";
import "./index.css";
import { TooltipProvider } from "./components/ui/Tooltip.tsx";

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient();

const appearance = {
	variables: {
		colorPrimary: "#3b82f6",
		colorBackground: "#f4fafa",
		fontFamily: "Poppins"
	},
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<ClerkProvider publishableKey={clerkPubKey} appearance={appearance}>
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<Toaster />
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</TooltipProvider>
		</QueryClientProvider>
	</ClerkProvider>
);
