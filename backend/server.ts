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
import { Server } from "socket.io";
import { createServer } from "node:http";

const port = process.env.PORT || 5000;

const frontEndUrl = process.env.FRONTEND_URL;

connectDB();

const app = express();
const server = createServer(app);
const io = new Server({
  cors: {
    origin: "http://localhost:3000"
  }
});

io.listen(4000);

const corsOptions = {
  origin: frontEndUrl,
  optionsSuccessStatus: 200,
  credentials: true
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

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   socket.on("disconnect", (reason) => {
//     console.log(`user disconnected for ${reason}`);
//   });
// });

app.get("/pf/:projectName/:filename", renderFile);
app.get("/pf/:projectName", renderFile);

app.use(notFound);
app.use(errorHandler);

server.listen(port, () => console.log(`Server started on port: ${port}`));
