import { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface ThemeContextProps {
	theme: "light" | "dark";
	setTheme: (theme: "light" | "dark") => void;
	clearTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setThemeState] = useState<"light" | "dark">(
		localStorage.theme ||
			(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
	);

	const setTheme = (newTheme: "light" | "dark") => {
		localStorage.theme = newTheme;
		setThemeState(newTheme);
	};

	const clearTheme = () => {
		localStorage.removeItem("theme");
		setThemeState(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
	};

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme:dark)");
		const handleChange = () => {
			setThemeState(mediaQuery.matches ? "dark" : "light");
		};
		mediaQuery.addEventListener("change", handleChange);
		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, []);

	const value = { theme, setTheme, clearTheme };

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
