import { io } from "socket.io-client";

const port = 5000;
export const socket = io(`http://localhost:${port}`, {
  autoConnect: false
});