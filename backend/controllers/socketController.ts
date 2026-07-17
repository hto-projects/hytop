import { Socket, Server } from "socket.io";

const joinRoomByID = (socket: Socket, id: string, name: string, projectName: string) => {
  socket.join(`projectwithname${projectName}`);
  socket.join(id);
  socket.to(id).emit("userJoined", name, projectName);
};

const createRoom = (io: Server, socket: Socket) => {
  const roomID = Math.floor(Math.random() * 900000) + 100000;
  socket.join(roomID.toString());
  io.to(roomID.toString()).emit("joinedRoom", roomID.toString());
};

const sendInfo = (io: Server, projectName: string, roomName: string, messageLogs: string[]) => {
  io.to(`projectwithname${projectName}`).emit("getRoomInfo", roomName, messageLogs);
};

const sendMessageInChat = (io: Server, message: string, roomId: number) => {
  io.to(roomId.toString()).emit("recieveMessage", message);
};

export {
  joinRoomByID,
  createRoom,
  sendInfo,
  sendMessageInChat
};