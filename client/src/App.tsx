import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Preview from "./pages/Preview";
import NotFound from "./pages/NotFound";
import Layout from "./pages/Layout";
import Results from "./pages/Results";
import MyTests from "./pages/MyTests";
import Collaborations from "./pages/Collaborations";
import { useEffect } from "react";
import Schedule from "./pages/Schedule";
import Overview from "./pages/Overview";
import StudyGroups from "./pages/StudyGroups";
import ProtectedRoute from "./components/ProtectedRoute";
import StudyGroupChat from "./pages/StudyGroupChat";
import Bookmarked from "./pages/Bookmarked";
import { useTheme } from "./components/ThemeProvider";

function App() {
	const { theme } = useTheme();

	useEffect(() => {
		// On page load or when changing themes, add inline in `head` to avoid FOUC
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);

	return (
		<Routes>
			<Route path="*" element={<NotFound />} />
			<Route path="/" element={<Home />} />
			<Route
				path="/create"
				element={
					<Layout>
						<Create />
					</Layout>
				}
			/>
			<Route
				path="/create/:id"
				element={
					<ProtectedRoute>
						<Layout>
							<Create />
						</Layout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/create/preview"
				element={
					<ProtectedRoute>
						<Layout>
							<Preview />
						</Layout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/create/preview/results"
				element={
					<ProtectedRoute>
						<Layout>
							<Results />
						</Layout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/tests/:id"
				element={
					<ProtectedRoute>
						<Layout>
							<MyTests />
						</Layout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/collaborations/:id"
				element={
					<ProtectedRoute>
						<Layout>
							<Collaborations />
						</Layout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/bookmarked/:id"
				element={
					<ProtectedRoute>
						<Layout>
							<Bookmarked />
						</Layout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/solve/:id"
				element={
					<Layout>
						<Preview />
					</Layout>
				}
			/>
			<Route
				path="/solve/results"
				element={
					<ProtectedRoute>
						<Layout>
							<Results />
						</Layout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/schedule/:id"
				element={
					<ProtectedRoute>
						<Layout>
							<Schedule />
						</Layout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/overview/:id"
				element={
					<ProtectedRoute>
						<Layout>
							<Overview />
						</Layout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/groups"
				element={
					<ProtectedRoute>
						<Layout>
							<StudyGroups />
						</Layout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/groups/:id"
				element={
					<ProtectedRoute>
						<Layout className="max-h-screen">
							<StudyGroupChat />
						</Layout>
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
}

export default App;
