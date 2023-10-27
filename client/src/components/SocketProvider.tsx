import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

interface SocketContextType {
	socket: any | null;
	isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
	socket: null,
	isConnected: false,
});

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const [socket, setSocket] = useState<any>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		// const socket = io(`${import.meta.env.VITE_API_BASE_URL}`,{path:"/"});
		const socket = io(`http://localhost:3000`, { path: "/api/socket", addTrailingSlash: false });

		socket.on("connect", () => {
			setIsConnected(true);
		});

		socket.on("disconnect", () => {
			setIsConnected(false);
		});

        socket.on("error", (error) => {
            console.error("Socket.io error:", error);
          });
          

		setSocket(socket);

		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
	);
};

export default SocketProvider;
