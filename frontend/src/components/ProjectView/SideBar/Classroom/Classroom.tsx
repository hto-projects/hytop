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

const Classroom = ({ closePane, hidden }) => {
  const [roomIdInput, setRoomIdInput] = useState("");
  const [roomNameInput, setRoomNameInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messagesSent, setMessagesSent] = useState([]);
  const [messageLogs, setMessageLogs] = useState<React.JSX.Element[]>([]);
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
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
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

  const joinRoomByID = () => {
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

  const handleEnterShortCut = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key !== "Enter") return;
    callback();
  };

  useEffect(() => {
    const messages = messagesSent
      .map((message, index) => {
        return (
          <Text 
            key={index}
            ml="xs" 
            mb="xs" 
            fz="xs" 
            ff="monospace"
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: "6px",
              padding: "0.2rem",
              maxWidth: "90%",
              width: "max-content"
            }}
          >
            {message}
          </Text>
        );
      })
      .reverse();
    setMessageLogs(messages);

    if (!isRoomCreator) return;
    localStorage.setItem("messageLogs", JSON.stringify(messagesSent));
  }, [messagesSent, isRoomCreator]);

  useEffect(() => {
    socket.on(CREATOR_JOINED_ROOM, (id) => {
      dispatch(setRoomId(id));
    });

    socket.on(USER_JOINED, (name, projectName) => {
      // over here we can have another pop up showing who joined the room or not
      if (!isRoomCreator) return;
      socket.emit(SEND_INFO, projectName, roomName, JSON.parse(localStorage.getItem("messageLogs")));
      setMostRecentJoinedUser(name);
      setUserJustJoined(true);
      setTimeout(() => {
        setUserJustJoined(false);
      }, 5000);
    });

    socket.on(GET_ROOM_INFO, (roomName, messageLogs) => {
      dispatch(setRoomName(roomName));
      setMessagesSent([...messageLogs]);
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
          borderBottom:
            theColorScheme === "dark" ? "1px solid #333" : "1px solid #eee",
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
        <Text fw={700} mb="xs">
          Classroom Portal
        </Text>
        {
          isInRoom ?
            <Box p={8} style={{ minWidth: 240 }}>
              <Text size="xs" fw="bold">Welcome to "{roomName}"</Text>
              <Text size="xs">Room Id: {roomId}</Text>
              <Space h="md"></Space>
              <Box
                style={{
                  height: "40vh",
                  width: "94%",
                  background: theColorScheme === "dark" ? primaryColor : undefined,
                  color: theColorScheme === "dark" ? "#fff" : undefined,
                  borderRadius: "7px",
                  display: "flex",
                  flexDirection: "column-reverse",
                  overflowY: "auto",
                }}
              >
                {messageLogs} 
              </Box>
              <Space h="lg"></Space>
              <Group hidden={!isRoomCreator}>
                <TextInput
                  description="Send Message in Chat"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => handleEnterShortCut(e, sendMessage)}
                  size="xs"
                  mb="xs"
                  styles={{
                    input: {
                      color: theColorScheme === "dark" ? "#fff" : undefined,
                      fontFamily: "monospace"
                    },
                    label: {
                      color: theColorScheme === "dark" ? "#fff" : undefined,
                      fontSize: 12
                    }
                  }}
                />
                <Button
                  size="xs"
                  color={primaryColor}
                  onClick={sendMessage}
                  style={{ fontWeight: 600, marginTop: "-0.77rem" }}
                >
                  Send
                </Button>
              </Group>
              <Group hidden={isRoomCreator}>
                <Button
                  size="xs"
                  color={primaryColor}
                  onClick={leaveRoom}
                  style={{ fontWeight: 600, marginTop: "-0.77rem" }}
                >
                  Leave Room
                </Button>
              </Group>
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
                        title="Farewell!"
                        onClose={() => setUserJustLeft(false)}
                      >
                        {mostRecentLeavingUser} has just left the chat room!
                      </Notification>
                    </div>
                  )}
              </Transition>
            </Box>
            : 
            /// IF NOT IN ROOM ///
            <Box p={8} style={{ minWidth: 240 }}>
              <TextInput
                label="Join by Classroom ID"
                description="Enter the ID of the classroom you want to join"
                // value={nameInput}
                onChange={(e) => setRoomIdInput(e.currentTarget.value)}
                onKeyDown={(e) => handleEnterShortCut(e, joinRoomByID)}
                size="xs"
                mb="xs"
                autoFocus
                styles={{
                  input: {
                    color: theColorScheme === "dark" ? "#fff" : undefined,
                    fontFamily: "monospace"
                  },
                  label: {
                    color: theColorScheme === "dark" ? "#fff" : undefined,
                    fontSize: 12
                  },
                  description: {
                    color: theColorScheme === "dark" ? "#888" : "#666",
                    fontSize: 10
                  }
                }}
              />
              <Button
                size="xs"
                color={primaryColor}
                onClick={joinRoomByID}
                style={{ fontWeight: 600 }}
              >
                Join
              </Button>
              <TextInput
                label="Create a Room"
                // value={descInput}
                onChange={(e) => setRoomNameInput(e.currentTarget.value)}
                onKeyDown={(e) => handleEnterShortCut(e, createRoom)}
                size="xs"
                mb="xs"
                styles={{
                  input: {
                    color: theColorScheme === "dark" ? "#fff" : undefined,
                    fontFamily: "monospace"
                  },
                  label: {
                    color: theColorScheme === "dark" ? "#fff" : undefined,
                    fontSize: 12
                  }
                }}
              />
              <Group mt="xs" gap={8}>
                <Button
                  size="xs"
                  color={primaryColor}
                  onClick={createRoom}
                  style={{ fontWeight: 600 }}
                >
                  Create
                </Button>
              </Group>
            </Box>
        }
      </Box>
    </Paper>
  );
};

export default Classroom;