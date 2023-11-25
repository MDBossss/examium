import { ReactNode, createContext, useContext, useState } from "react";

interface SidebarContextProps{
    showSidebar: boolean;
    toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () =>{
    const context  = useContext(SidebarContext);
    if(!context){
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}

export const SidebarProvider = ({children}:{children:ReactNode}) => {
    const [showSidebar,setShowSidebar] = useState<boolean>(true)

    const toggleSidebar = () => {
        setShowSidebar((prev) => !prev)
    }

    const value = {showSidebar, toggleSidebar, setShowSidebar};

    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}
