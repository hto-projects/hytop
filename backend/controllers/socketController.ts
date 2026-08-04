import { Socket, Server } from "socket.io";
import { IoEventChannels } from "../../shared/constants";

const {
  USER_JOINED,
  CREATED_ROOM,
  GET_ROOM_INFO,
  GET_LEAVING_USER,
  RECIEVE_MESSAGE,
  RESET_ROOM_INFO,
  ROOM_DOESNT_EXISTS,
  ALL_ROOMS_UPDATED,
  RECEIVE_PARTICIPANTS,
  CLOSED_ROOM
} = IoEventChannels;

/** basically we need a straight forward way to filter out the classrooms from the socket id private rooms */
const classroomIdPrefix = "classroom:id=";
const getClassroomId = (id: string) => {
  return `${classroomIdPrefix}${id}`;
};

/** used in leaveRoom and createRooms just to make sure that the data object on io doesn't have any empty classRooms rooms */
const updateAllClassrooms = (io: Server) => {
  const allClassroomsAdapter =
    Array
      .from(io.sockets.adapter.rooms)
      .filter((value) => value[0].includes(classroomIdPrefix));

  const allClassroomIdsFromAdapter = 
    allClassroomsAdapter.map((value) => value[0].replace(classroomIdPrefix, ""));

  io.data.classRooms = 
    io.data.classRooms.filter((room) => allClassroomIdsFromAdapter.includes(room.id));

  io.emit(ALL_ROOMS_UPDATED, io.data.classRooms);
};

const sendParticipants = (io: Server, roomId: string) => {
  const joinedClassroom = io.data.classRooms.find((classroom) => classroom.id === roomId);
  io
  	.to(getClassroomId(roomId))
	.emit(RECEIVE_PARTICIPANTS, joinedClassroom ? joinedClassroom.participants : []);
};

const joinRoomByID = (io: Server, socket: Socket, roomId: string, name: string, isRoomCreator: boolean) => {
  if (!io.sockets.adapter.rooms.get(getClassroomId(roomId))) {
    io.to(socket.id).emit(ROOM_DOESNT_EXISTS);
    return;
  }

  socket.join(getClassroomId(roomId));
  socket.to(getClassroomId(roomId)).emit(USER_JOINED, name, socket.id, roomId, isRoomCreator);

  if (!isRoomCreator) {
    const joinedClassroom = io.data.classRooms.find((classroom) => classroom.id === roomId);
    joinedClassroom.participants.push(name);
  }
  
  sendParticipants(io, roomId);
};

const leaveRoom = (io: Server, socket: Socket, id: string, name: string, isRoomCreator: boolean) => {
  io.to(socket.id).emit(RESET_ROOM_INFO);
  socket.leave(getClassroomId(id));
  socket.to(getClassroomId(id)).emit(GET_LEAVING_USER, name, isRoomCreator);
  updateAllClassrooms(io);

  if (!isRoomCreator) {
    const joinedClassroom = io.data.classRooms.find((classroom) => classroom.id === id);
	if (joinedClassroom) {
		joinedClassroom.participants.splice(joinedClassroom.participants.indexOf(name), 1);
	}
  }
  
  sendParticipants(io, id);
};

const createRoom = (io: Server, socket: Socket, roomName: string) => {
  const roomId = Math.floor(Math.random() * 900000) + 100000;
  socket.join(getClassroomId(roomId.toString()));
  io.to(getClassroomId(roomId.toString())).emit(CREATED_ROOM, roomId.toString(), roomName);
  io.data.classRooms.push({ id: roomId.toString(), name: roomName, participants: [] });
  updateAllClassrooms(io);
};

const sendInfo = (io: Server, userSocketId: string, roomName: string, roomId: string, messageLogs: string[]) => {
  io.to(userSocketId).emit(GET_ROOM_INFO, roomName, roomId, messageLogs);
};

const sendMessageInChat = (io: Server, message: string, roomId: number) => {
  io.to(getClassroomId(roomId.toString())).emit(RECIEVE_MESSAGE, message);
};

/** 
 * Reason why we're not using something like io.in("room1").socketsLeave("room1");
 * is because there's other logic that has to happen besides just making a socket
 * leave the room. Hence I'm just reusing the leaveRoom function for this task.
 * (This function makes all sockets in that room emit the leaveRoom event)
 */
const closeRoom = (io: Server, roomId: string) => {
	io.to(getClassroomId(roomId)).emit(CLOSED_ROOM);
};

export {
  updateAllClassrooms,
  joinRoomByID,
  leaveRoom,
  createRoom,
  sendInfo,
  sendMessageInChat,
  closeRoom
};