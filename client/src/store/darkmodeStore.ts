import {create} from "zustand";

interface DarkmodeState{
    isDarkmode: boolean,
    toggleDarkmode: () => void
}

export const useDarkmodeStore = create<DarkmodeState>()((set) => ({
    isDarkmode: false,
    toggleDarkmode: () => {
        set((state) => ({isDarkmode: !state.isDarkmode}))
    }
}))