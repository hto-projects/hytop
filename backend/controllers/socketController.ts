import { Socket, Server } from "socket.io";
import { IoEventChannels } from "../../shared/constants";

const {
  USER_JOINED,
  CREATOR_JOINED_ROOM,
  GET_ROOM_INFO,
  GET_LEAVING_USER,
  RECIEVE_MESSAGE,
  RESET_ROOM_INFO,
} = IoEventChannels;

const joinRoomByID = (socket: Socket, id: string, name: string, projectName: string) => {
  socket.join(`projectwithname${projectName}`);
  socket.join(id);
  socket.to(id).emit(USER_JOINED, name, projectName);
};

const leaveRoom = (io: Server, socket: Socket, id: string, name: string, projectName: string) => {
  socket.leave(id);
  socket.to(id).emit(GET_LEAVING_USER, name);
  io.to(`projectwithname${projectName}`).emit(RESET_ROOM_INFO);
};

const createRoom = (io: Server, socket: Socket) => {
  const roomId = Math.floor(Math.random() * 900000) + 100000;
  socket.join(roomId.toString());
  io.to(roomId.toString()).emit(CREATOR_JOINED_ROOM, roomId.toString());
};

const sendInfo = (io: Server, projectName: string, roomName: string, messageLogs: string[]) => {
  io.to(`projectwithname${projectName}`).emit(GET_ROOM_INFO, roomName, messageLogs);
};

const sendMessageInChat = (io: Server, message: string, roomId: number) => {
  io.to(roomId.toString()).emit(RECIEVE_MESSAGE, message);
};

export {
  joinRoomByID,
  leaveRoom,
  createRoom,
  sendInfo,
  sendMessageInChat,
};