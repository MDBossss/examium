// ThemeWrapper.tsx
import { ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import { useThemeStore } from "../store/themeStore.ts";
import { getDesignTokens } from "../utils/schedulerTheme.ts";

interface Props {
	children: ReactNode;
}

const MaterialThemeProvider = ({ children }: Props) => {
	const { theme } = useThemeStore();
	const materialTheme = createTheme(getDesignTokens(theme));

	return <ThemeProvider theme={materialTheme}>{children}</ThemeProvider>;
};

export default MaterialThemeProvider;
