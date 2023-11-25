import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "./components/ui/Toaster.tsx";
import "./index.css";
import MaterialThemeProvider from "./components/MaterialThemeProvider.tsx";
import SocketProvider from "./components/SocketProvider.tsx";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { SidebarProvider } from "./components/SidebarProvider.tsx";

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient();

const appearance = {
	variables: {
		colorPrimary: "#3b82f6",
		colorBackground: "#fff",
		fontFamily: "Poppins",
	},
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<ThemeProvider>
		<SidebarProvider>
			<ClerkProvider publishableKey={clerkPubKey} appearance={appearance}>
				<MaterialThemeProvider>
					<SocketProvider>
						<QueryClientProvider client={queryClient}>
							<Toaster />
							<BrowserRouter>
								<App />
							</BrowserRouter>
						</QueryClientProvider>
					</SocketProvider>
				</MaterialThemeProvider>
			</ClerkProvider>
		</SidebarProvider>
	</ThemeProvider>
);
