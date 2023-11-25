// ThemeWrapper.tsx
import { ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import { getDesignTokens } from "../utils/schedulerTheme.ts";
import { useTheme } from "./ThemeProvider.tsx";

interface Props {
	children: ReactNode;
}

const MaterialThemeProvider = ({ children }: Props) => {
	const { theme } = useTheme();
	const materialTheme = createTheme(getDesignTokens(theme));

	return <ThemeProvider theme={materialTheme}>{children}</ThemeProvider>;
};

export default MaterialThemeProvider;
