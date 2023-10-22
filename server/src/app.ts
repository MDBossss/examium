import { config } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import testRoutes from "./routes/testRoutes";
import codeRoutes from "./routes/codeRoutes";
import eventRoutes from "./routes/eventRoutes";
import groupRoutes from "./routes/groupRoutes";

config();

const app = express();

//Middleware
app.use(cors());


//Routes
app.use("/api/users",userRoutes);
app.use("/api/tests",testRoutes);
app.use("/api/code",codeRoutes)
app.use("/api/events",eventRoutes)
app.use("/api/groups",groupRoutes)

//Error handling middleware
app.use((err:Error,req:Request,res:Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({error: "Internal Server Error"});
})

//Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
