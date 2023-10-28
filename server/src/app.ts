import { config } from "dotenv";
import http from "http";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import testRoutes from "./routes/testRoutes";
import codeRoutes from "./routes/codeRoutes";
import eventRoutes from "./routes/eventRoutes";
import groupRoutes from "./routes/groupRoutes";
import messageRoutes from "./routes/messageRoutes";
import { initializeSocketIo } from "./utils/socket";

config();

const app = express();
const httpServer = http.createServer(app);

//Middleware
app.use(cors());


//Routes
app.use("/api/users",userRoutes);
app.use("/api/tests",testRoutes);
app.use("/api/code",codeRoutes)
app.use("/api/events",eventRoutes)
app.use("/api/groups",groupRoutes)
app.use("/api/messages",messageRoutes);

//Error handling middleware
app.use((err:Error,req:Request,res:Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({error: "Internal Server Error"});
})

// Initialize Socket.io and attach it to the HTTP server
initializeSocketIo(httpServer);

//Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
