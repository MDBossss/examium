import { Server } from "socket.io";

let io: Server;

export const initializeSocketIo = (httpServer: any) => {
	io = new Server(httpServer, {
		path: "/api/socket/io",
		addTrailingSlash: false,
		cors: { origin: "*" },
	});
	return io;
};

export { io };
