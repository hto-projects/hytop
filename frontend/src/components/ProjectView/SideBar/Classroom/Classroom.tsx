import { PiXBold } from "react-icons/pi";
import { Paper, Group, Text, Box, ActionIcon } from "@mantine/core";
import { useComputedColorScheme } from "@mantine/core";
import { SIDEBAR_ICON_MAP, SIDEBAR_WIDTH } from "../../constants";
import { useSelector } from "react-redux";
import { socket } from "../../../../socket";
import { IoEventChannels } from "../../../../../../shared/constants";
import { useEffect, useState } from "react";
import { setRoomName, setRoomId, setIsInRoom, setIsRoomCreator } from "../../../../slices/roomSlice";
import { useDispatch } from "react-redux";
import ClassroomJoinPane from "./ClassroomJoinPane";
import ClassroomMessagesPane from "./ClassroomMessagesPane";
import ClassroomNotification from "./ClassroomNotification";

const Classroom = ({ closePane, hidden }) => {
  const [roomIdInput, setRoomIdInput] = useState("");
  const [roomNameInput, setRoomNameInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messagesSent, setMessagesSent] = useState([]);

  const [userJustJoined, setUserJustJoined] = useState(false);
  const [mostRecentJoinedUser, setMostRecentJoinedUser] = useState("");
  const [userJustLeft, setUserJustLeft] = useState(false);
  const [mostRecentLeavingUser, setMostRecentLeavingUser] = useState("");
  
  const [teacherJustJoined, setTeacherJustJoined] = useState(false);
  const [teacherJustLeft, setTeacherJustLeft] = useState(false);

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
    GET_LEAVING_USER
  } = IoEventChannels;

  const joinRoomById = () => {
    socket.emit(JOIN_ROOM_BY_ID, roomIdInput, name);
    dispatch(setRoomId(roomIdInput));
    dispatch(setIsInRoom(true));
    if (sessionStorage.getItem(`roomsCreated:${authId}:${roomIdInput}`) === roomIdInput) {
      dispatch(setIsRoomCreator(true));
    }
  };
  
  const createRoom = () => {
    socket.emit(CREATE_ROOM);
    dispatch(setRoomName(roomNameInput));
    dispatch(setIsInRoom(true));
    dispatch(setIsRoomCreator(true));
  };

  const sendMessage = () => {
    socket.emit(SEND_MESSAGE, messageInput, roomId);
    setMessageInput("");
  };

  const leaveRoom = () => {
    socket.emit(LEAVE_ROOM, roomId, name);
  }

  useEffect(() => {
    socket.on(CREATED_ROOM, (id) => {
      dispatch(setRoomId(id));
      sessionStorage.setItem(`roomsCreated:${authId}:${id}`, id);
    });

    socket.on(USER_JOINED, (name, userSocketId) => {
      if (isRoomCreator) {
        socket.emit(SEND_INFO, userSocketId, roomName, JSON.parse(localStorage.getItem("messageLogs")));
        setMostRecentJoinedUser(name);
        setUserJustJoined(true);
        setTimeout(() => {
          setUserJustJoined(false);
        }, 5000);
      } else {
        socket.emit(SEND_INFO, userSocketId, roomName, messagesSent);
        setTeacherJustJoined(true);
        setTimeout(() => {
          setTeacherJustJoined(false);
        }, 5000);
      }
    });

    socket.on(GET_ROOM_INFO, (roomName, messagesBeforeJoined) => {
      dispatch(setRoomName(roomName));
      setMessagesSent([...messagesBeforeJoined]);
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

    socket.on(GET_LEAVING_USER, (name) => {
      if (isRoomCreator) {
        setMostRecentLeavingUser(name);
        setUserJustLeft(true);
        setTimeout(() => {
          setUserJustLeft(false);
        }, 5000);
      } else {
        setTeacherJustLeft(true);
        setTimeout(() => {
          setTeacherJustLeft(false);
        }, 5000);
      }
    });

    return () => {
      socket.off(CREATED_ROOM);
      socket.off(USER_JOINED);
      socket.off(GET_ROOM_INFO);
      socket.off(RECIEVE_MESSAGE);
      socket.off(RESET_ROOM_INFO);
      socket.off(GET_LEAVING_USER);
    };
  }, [isInRoom, isRoomCreator, roomId, roomName, messagesSent]);

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
              setRoomIdInput={setRoomIdInput}
              setRoomNameInput={setRoomNameInput}
              joinRoomById={joinRoomById}
              createRoom={createRoom}
            />
        }
      </Box>
    </Paper>
  );
};

export default Classroom;