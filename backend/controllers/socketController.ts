import { Socket, Server } from "socket.io";
import { IoEventChannels } from "../../shared/constants";

const {
  USER_JOINED,
  CREATED_ROOM,
  GET_ROOM_INFO,
  GET_LEAVING_USER,
  RECIEVE_MESSAGE,
  RESET_ROOM_INFO,
} = IoEventChannels;

/** need a way to privately message users */
const joinRoomByID = (socket: Socket, id: string, name: string) => {
  socket.join(`userwithsocketid:${socket.id}`);
  socket.join(id);
  socket.to(id).emit(USER_JOINED, name, socket.id);
};

const leaveRoom = (io: Server, socket: Socket, id: string, name: string) => {
  io.to(`userwithsocketid:${socket.id}`).emit(RESET_ROOM_INFO);
  socket.leave(`userwithsocketid:${socket.id}`);
  socket.leave(id);
  socket.to(id).emit(GET_LEAVING_USER, name);
};

const createRoom = (io: Server, socket: Socket) => {
  const roomId = Math.floor(Math.random() * 900000) + 100000;
  socket.join(roomId.toString());
  socket.join(`userwithsocketid:${socket.id}`);
  io.to(roomId.toString()).emit(CREATED_ROOM, roomId.toString());
};

const sendInfo = (io: Server, userSocketId: string, roomName: string, messageLogs: string[]) => {
  io.to(`userwithsocketid:${userSocketId}`).emit(GET_ROOM_INFO, roomName, messageLogs);
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