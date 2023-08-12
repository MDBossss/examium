import {create} from "zustand";

interface ThemeState{
    theme: "light" | "dark",
    setTheme: (theme: "light" | "dark") => void,
    clearTheme: () => void

}

export const useThemeStore = create<ThemeState>()((set) => ({
    theme: localStorage.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    setTheme: (theme) => {
        localStorage.theme = theme
        set({theme})
    },
    clearTheme: () => {
        localStorage.removeItem("theme");
        set({ theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' });
    }
}))