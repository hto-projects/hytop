import { PiXBold } from "react-icons/pi";
import { Paper, Group, Text, Box, ActionIcon, Input } from "@mantine/core";
import { useComputedColorScheme } from "@mantine/core";
import { SIDEBAR_ICON_MAP, SIDEBAR_WIDTH } from "../../constants";
import { useSelector } from "react-redux";
import { socket } from "../../../../socket";
import { IoEventChannels } from "../../../../../../shared/constants";
import { useEffect, useRef, useState } from "react";
import { setRoomName, setRoomId, setIsInRoom, setIsRoomCreator } from "../../../../slices/roomSlice";
import { useDispatch } from "react-redux";
import ClassroomJoinPane from "./ClassroomJoinPane";
import ClassroomMessagesPane from "./ClassroomMessagesPane";
import ClassroomNotification from "./ClassroomNotification";
import { Classroom as TClassroom } from "../../../../../../shared/types";

const Classroom = ({ closePane, hidden }) => {
  // NO ADMIN LOGIC RIGHT NOW
  const [roomNameInput, setRoomNameInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messagesSent, setMessagesSent] = useState([]);

  const roomIdFromInput = useRef("");
  
  const [userJustJoined, setUserJustJoined] = useState(false);
  const [mostRecentJoinedUser, setMostRecentJoinedUser] = useState("");
  const [userJustLeft, setUserJustLeft] = useState(false);
  const [mostRecentLeavingUser, setMostRecentLeavingUser] = useState("");
  
  const [teacherJustJoined, setTeacherJustJoined] = useState(false);
  const [teacherJustLeft, setTeacherJustLeft] = useState(false);

  const [allClassrooms, setAllClassrooms] = useState<TClassroom[]>([]);
  const [roomDoesntExists, setRoomDoesntExists] = useState(false);
  let notificationSlideOutTimeout: number | null = null;

  const dispatch = useDispatch();

  const {
    roomName,
    roomId,
    isInRoom,
    isRoomCreator,
  } = useSelector((state: any) => state.room);
  const name = useSelector((state: any) => state.auth.userInfo.name); 
  const authId = useSelector((state: any) => state.auth.userInfo._id);
  const theColorScheme = useComputedColorScheme("light");
  const notificationTimeoutDuration = 5000;

  const {
    CREATE_ROOM,
    JOIN_ROOM_BY_ID,
    CREATED_ROOM,
    USER_JOINED,
    LEAVE_ROOM,
    GET_ROOM_INFO,
    SEND_INFO,
    SEND_MESSAGE,
    RECIEVE_MESSAGE,
    RESET_ROOM_INFO,
    GET_LEAVING_USER,
    ROOM_DOESNT_EXISTS,
    ALL_ROOMS_UPDATED
  } = IoEventChannels;

  const roomsCreated: string[] = (() => {
    const roomsCreated = JSON.parse(sessionStorage.getItem(`roomsCreatedBy:${authId}`));
    if (roomsCreated) {
      return roomsCreated;
    } else {
      sessionStorage.setItem(`roomsCreatedBy:${authId}`, JSON.stringify([]));
      return [];
    }
  })();

  const joinRoomById = () => {
    socket.emit(JOIN_ROOM_BY_ID, roomIdFromInput.current, name, roomsCreated.includes(roomIdFromInput.current));
  };
  
  const createRoom = () => {
    socket.emit(CREATE_ROOM, roomNameInput);
  };

  const sendMessage = () => {
    socket.emit(SEND_MESSAGE, messageInput, roomId);
    setMessageInput("");
  };

  const leaveRoom = () => {
    socket.emit(LEAVE_ROOM, roomId, name, isRoomCreator);
  };

  useEffect(() => {
    socket.on(CREATED_ROOM, (id, roomName) => {
      dispatch(setRoomId(id));
      dispatch(setRoomName(roomName));
      dispatch(setIsInRoom(true));
      dispatch(setIsRoomCreator(true));
      roomsCreated.push(id);
      sessionStorage.setItem(`roomsCreatedBy:${authId}`, JSON.stringify(roomsCreated));
    });

    socket.on(USER_JOINED, (name, userSocketId, roomId, isRoomCreator) => {
      if (isRoomCreator) {
        socket.emit(SEND_INFO, userSocketId, roomName, roomId, messagesSent);
        setTeacherJustJoined(true);
        setTimeout(() => setTeacherJustJoined(false), notificationTimeoutDuration);
      } else {
        socket.emit(SEND_INFO, userSocketId, roomName, roomId, JSON.parse(localStorage.getItem("messageLogs")));
        setMostRecentJoinedUser(name);
        setUserJustJoined(true);
        setTimeout(() => setUserJustJoined(false), notificationTimeoutDuration);
      }
    });

    socket.on(GET_ROOM_INFO, (roomName, roomId, messagesBeforeJoined) => {
      dispatch(setRoomName(roomName));
      dispatch(setRoomId(roomId));
      dispatch(setIsInRoom(true));
      setMessagesSent([...messagesBeforeJoined]);
      if (roomsCreated.includes(roomIdFromInput.current)) {
        dispatch(setIsRoomCreator(true));
      }
    });

    socket.on(RECIEVE_MESSAGE, (message) => {
      setMessagesSent([...messagesSent, message]);
    });

    socket.on(RESET_ROOM_INFO, () => {
      dispatch(setIsInRoom(false));
      dispatch(setIsRoomCreator(false));
      dispatch(setRoomId(""));
      dispatch(setRoomName(""));
      setMessagesSent([]);
    });

    socket.on(GET_LEAVING_USER, (name, isRoomCreator) => {
      if (isRoomCreator) {
        setTeacherJustLeft(true);
        setTimeout(() => setTeacherJustLeft(false), notificationTimeoutDuration);
      } else {
        setMostRecentLeavingUser(name);
        setUserJustLeft(true);
        setTimeout(() => setUserJustLeft(false), notificationTimeoutDuration);
      }
    });

    socket.on(ROOM_DOESNT_EXISTS, () => {
      setRoomDoesntExists(true);
      clearTimeout(notificationSlideOutTimeout);
      notificationSlideOutTimeout = setTimeout(() => {
        setRoomDoesntExists(false)
        setRoomIdErrorMsgWasSet(false);
      }, notificationTimeoutDuration);
    });

    socket.on(ALL_ROOMS_UPDATED, (allClassrooms) => {
      setAllClassrooms([...allClassrooms]);
    });

    return () => {
      socket.off(CREATED_ROOM);
      socket.off(USER_JOINED);
      socket.off(GET_ROOM_INFO);
      socket.off(RECIEVE_MESSAGE);
      socket.off(RESET_ROOM_INFO);
      socket.off(GET_LEAVING_USER);
      socket.off(ROOM_DOESNT_EXISTS);
      socket.off(ALL_ROOMS_UPDATED);
    };
  }, [isInRoom, isRoomCreator, roomId, roomName, messagesSent]);


  const [roomIdErrorMsg, setRoomIdErrorMsg] = useState("");
  /** this is here so that if the notification is already up it stops the id value from updating when the user types */
  const [roomIdErrorMsgWasSet, setRoomIdErrorMsgWasSet] = useState(false);

  useEffect(() => {
    if (!roomDoesntExists || (roomIdErrorMsgWasSet && roomDoesntExists)) {
      return;
    };

    setRoomIdErrorMsg(roomIdFromInput.current); 
    setRoomIdErrorMsgWasSet(true);
  }, [roomDoesntExists, roomIdErrorMsgWasSet]);

  return (
    <Paper
      hidden={hidden}
      shadow="xs"
      p={0}
      style={{
        width: SIDEBAR_WIDTH,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.1s",
        color: theColorScheme === "dark" ? "white" : undefined,
        backgroundColor: theColorScheme === "dark" ? "#181A1B" : undefined,
        overflow: "hidden"
      }}
    >
      <ClassroomNotification 
        mounted={userJustJoined}
        onClose={() => setUserJustJoined(false)}
        title="Hey there!"
        message={`${mostRecentJoinedUser} has just joined the chat room!`}
      />
      <ClassroomNotification 
        mounted={userJustLeft}
        onClose={() => setUserJustLeft(false)}
        title="See you later!"
        message={`${mostRecentLeavingUser} has just left the chat room!`}
      />
      <ClassroomNotification 
        mounted={teacherJustLeft}
        onClose={() => setTeacherJustLeft(false)}
        title="Class has ended!"
        message="The teacher has just left the chat room!"
      />
      <ClassroomNotification 
        mounted={teacherJustJoined}
        onClose={() => setTeacherJustJoined(false)}
        title="Class is back up!"
        message="The teacher has just rejoined the chat room!"
      />
      <ClassroomNotification 
        mounted={roomDoesntExists}
        onClose={() => {
          setRoomDoesntExists(false);
          setRoomIdErrorMsgWasSet(false);
        }}
        title="Oops!"
        message={`The room you tried to join (${roomIdErrorMsg}) doesn't exists`}
      />
      <Group
        align="apart"
        px="sm"
        py="xs"
        style={{
          borderBottom: theColorScheme === "dark" ? "1px solid #333" : "1px solid #eee",
          background: theColorScheme === "dark" ? "#181A1B" : undefined
        }}
      >
        <Group gap={4}>
          {SIDEBAR_ICON_MAP["Classroom"]}
          <Text size="sm">Classroom</Text>
        </Group>
        <ActionIcon
          variant="subtle"
          onClick={() => closePane("settings")}
          size="sm"
        >
          <PiXBold />
        </ActionIcon>
      </Group>
      <Box
        style={{
          flex: 1,
          minHeight: 0,
          padding: 16,
          background: theColorScheme === "dark" ? "#181A1B" : undefined,
          overflowY: "auto",
          height: "100%"
        }}
      >
        <Text fw={700} mb="xs">Classroom Portal</Text>
        {
          isInRoom ?
            <ClassroomMessagesPane 
              messagesSent={messagesSent}
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              sendMessage={sendMessage}
              leaveRoom={leaveRoom}
            />
            : 
            <ClassroomJoinPane 
              roomIdFromInput={roomIdFromInput}
              setRoomNameInput={setRoomNameInput}
              joinRoomById={joinRoomById}
              createRoom={createRoom}
              rooms={allClassrooms}
            />
        }
      </Box>
    </Paper>
  );
};

export default Classroom;