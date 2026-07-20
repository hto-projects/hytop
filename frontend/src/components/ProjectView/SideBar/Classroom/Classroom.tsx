import { PiXBold } from "react-icons/pi";
import { Paper, Group, Text, Box, Button, ActionIcon, TextInput, Space, Notification, Transition } from "@mantine/core";
import { useComputedColorScheme } from "@mantine/core";
import { SIDEBAR_ICON_MAP, SIDEBAR_WIDTH } from "../../constants";
import { useSelector } from "react-redux";
import { socket } from "../../../../socket";
import { IoEventChannels } from "../../../../../../shared/constants";
import React, { useEffect, useState } from "react";
import { setRoomName, setRoomId, setIsInRoom, setIsRoomCreator } from "../../../../slices/roomSlice";
import { useDispatch } from "react-redux";
import ClassroomJoinPane from "./ClassroomJoinPane";
import ClassroomMessagesPane from "./ClassroomMessagesPane";

const Classroom = ({ closePane, hidden }) => {
  const [roomIdInput, setRoomIdInput] = useState("");
  const [roomNameInput, setRoomNameInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messagesSent, setMessagesSent] = useState([]);
  const [userJustJoined, setUserJustJoined] = useState(false);
  const [mostRecentJoinedUser, setMostRecentJoinedUser] = useState("");
  const [userJustLeft, setUserJustLeft] = useState(false);
  const [mostRecentLeavingUser, setMostRecentLeavingUser] = useState("");

  const dispatch = useDispatch();

  const {
    roomName,
    roomId,
    isInRoom,
    isRoomCreator,
  } = useSelector((state: any) => state.room);
  const name = useSelector((state: any) => state.auth.userInfo.name);
  const theColorScheme = useComputedColorScheme("light");
  const projectName = useSelector((state: any) => state.editor.projectName);

  const {
    CREATE_ROOM,
    JOIN_ROOM_BY_ID,
    CREATOR_JOINED_ROOM,
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
    socket.emit(JOIN_ROOM_BY_ID, roomIdInput, name, projectName);
    dispatch(setRoomId(roomIdInput));
    dispatch(setIsInRoom(true));
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
    socket.emit(LEAVE_ROOM, roomId, name, projectName);
  }

  useEffect(() => {
    socket.on(CREATOR_JOINED_ROOM, (id) => {
      dispatch(setRoomId(id));
    });

    socket.on(USER_JOINED, (name, projectName) => {
      if (!isRoomCreator) return;
      socket.emit(SEND_INFO, projectName, roomName, JSON.parse(localStorage.getItem("messageLogs")));
      setMostRecentJoinedUser(name);
      setUserJustJoined(true);
      setTimeout(() => {
        setUserJustJoined(false);
      }, 5000);
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
    });

    socket.on(GET_LEAVING_USER, (name) => {
      if (!isRoomCreator) return;
      setMostRecentLeavingUser(name);
      setUserJustLeft(true);
      setTimeout(() => {
        setUserJustLeft(false);
      }, 5000);
    });

    return () => {
      socket.off(CREATOR_JOINED_ROOM);
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
          {SIDEBAR_ICON_MAP["Settings"]}
          <Text size="sm">Settings</Text>
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
      <Transition 
        mounted={userJustJoined} 
        duration={200} 
        timingFunction="ease-in"
        transition={"slide-left"}
      >
        {(TransitionStyle) => (
          <div
            style={{
              ...TransitionStyle,
              position: "absolute",
              right: "10vh",
              bottom: "10vh",
              width: "300px"
            }}
          >
            <Notification 
              title="Hey there!"
              onClose={() => setUserJustJoined(false)}
            >
              {mostRecentJoinedUser} has just joined the chat room!
            </Notification>
          </div>
        )}
      </Transition>
      <Transition 
        mounted={userJustLeft} 
        duration={200} 
        timingFunction="ease-in"
        transition={"slide-left"}
      >
        {(TransitionStyle) => (
          <div
            style={{
              ...TransitionStyle,
              position: "absolute",
              right: "10vh",
              bottom: "10vh",
              width: "300px"
            }}
          >
            <Notification 
              title="See you later!"
              onClose={() => setUserJustLeft(false)}
            >
              {mostRecentLeavingUser} has just left the chat room!
            </Notification>
          </div>
        )}
      </Transition>
    </Paper>
  );
};

export default Classroom;