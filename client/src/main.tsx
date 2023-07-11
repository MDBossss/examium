import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "./components/ui/Toaster.tsx";
import "./index.css";

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient();

const apperance = {
	variables: {
		colorPrimary: "#3b82f6",
	},
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<ClerkProvider publishableKey={clerkPubKey} appearance={apperance}>
		<QueryClientProvider client={queryClient}>
			<Toaster />
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</QueryClientProvider>
	</ClerkProvider>
);
