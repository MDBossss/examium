import { PaletteMode, ThemeOptions } from "@mui/material";

//this should be utility function
export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
	typography: {
		fontFamily: "Poppins, sans-serif", // Set the font-family to Poppins
        
	},
	palette: {
		mode,
		...(mode === "light"
			? {
					// palette values for light mode
					primary: { main: "#3b82f6" },
					secondary: { main: "#3b82f6" },
					divider: "#27272a",
					grey: {
						"300": "#d1d5db",
					},
                    background:{
                        default: "#e2e8f0",
                        paper: "#e2e8f0"
                    },
					text: {
						primary: "#27272a",
						secondary: "#27272a",
                        
					},
					error:{
						main: "#dc2626",
						light: "#dc2626"
					},
					action:{
						disabled: "#e2e8f0"
					}
                    
			  }
			: {
					// palette values for dark mode
					primary: { main: "#3b82f6"  },
					divider: "#27272a",
					grey: {
						"300": "#111827",
					},
					background: {
						default: "#030712",
						paper: "#030712",
					},
					text: {
						primary: "#e2e8f0",
						secondary: "#e2e8f0",
					},
					error:{
						main: "#dc2626",
						light: "#dc2626"
					},
					action:{
						disabled: "#e2e8f0"
					}
			  }),
	},
});
