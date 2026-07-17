import cors from "cors";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import userRoutes from "./routes/userRoutes";
import projectRoutes from "./routes/projectRoutes";
import fakeApiRoutes from "./routes/fakeApiRoutes";
import { renderFile } from "./controllers/projectController";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { createRoom, joinRoomByID, sendMessageInChat, sendInfo } from "./controllers/socketController";

const port = process.env.PORT || 5000;
const frontEndUrl = process.env.FRONTEND_URL;

connectDB();

const app = express();

const corsOptions = {
  origin: frontEndUrl,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/fake-api", fakeApiRoutes);

app.get("/up-check", (_req, res: any) => {
  res.status(200).send("<h1>BACKEND OPERATION NORMAL</h1>").end();
});

app.get("/pf/:projectName/:filename", renderFile);
app.get("/pf/:projectName", renderFile);

app.use(notFound);
app.use(errorHandler);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: corsOptions
});

io.on("connection", (socket) => {
  socket.on("joinRoomByID", (id, name, projectName) => joinRoomByID(socket, id, name, projectName));
  socket.on("createRoom", () => createRoom(io, socket));
  socket.on("sendInfo", (projectName, roomName, messageLogs) => sendInfo(io, projectName, roomName, messageLogs));
  socket.on("sendMessage", (message, roomId) => sendMessageInChat(io, message, roomId));
  socket.on("disconnect", () => console.log(`Disconnected: ${socket.id}`));
});

httpServer.listen(port, () => {
  console.log("Server is running");
});