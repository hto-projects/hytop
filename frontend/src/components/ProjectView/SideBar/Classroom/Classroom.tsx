import { PiXBold } from "react-icons/pi";
import { Paper, Group, Text, Box, Button, ActionIcon, TextInput, Space } from "@mantine/core";
import { SIDEBAR_ICON_MAP, SIDEBAR_WIDTH } from "../../constants";
import { useComputedColorScheme } from "@mantine/core";
import { useSelector } from "react-redux";
import { socket } from "../../../../socket";
import React, { useEffect, useState } from "react";
import { setRoomName, setRoomId, setIsInRoom, setIsRoomCreator } from "../../../../slices/roomSlice";
import { useDispatch } from "react-redux";

const Classroom = ({ closePane, hidden }) => {
  const [roomIdInput, setroomIdInput] = useState("");
  const [roomNameInput, setroomNameInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messagesSent, setMessagesSent] = useState([]);
  const [messageLogs, setMessageLogs] = useState<React.JSX.Element[]>([]);

  const dispatch = useDispatch();

  const {
    roomName,
    roomId,
    isInRoom,
    isRoomCreator,
  } = useSelector((state: any) => state.room);
  const theColorScheme = useComputedColorScheme("light");
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  const projectName = useSelector((state: any) => state.editor.projectName);

  const joinRoomByID = () => {
    socket.emit("joinRoomByID", roomIdInput, "brian patton", projectName);
    dispatch(setRoomId(roomIdInput));
    dispatch(setIsInRoom(true));
  };
  
  const createRoom = () => {
    socket.emit("createRoom");
    dispatch(setRoomName(roomNameInput));
    dispatch(setIsInRoom(true));
    dispatch(setIsRoomCreator(true));
  };

  const sendMessage = () => {
    socket.emit("sendMessage", messageInput, roomId);
  };

  useEffect(() => {
    setMessageLogs(messagesSent.map((message) => {
      return (
        <Text ml="xs" mb="xs" fz="xs" ff="monospace">{message}</Text>
      );
    }));
  }, [messagesSent]);
  
  useEffect(() => {
    if (!isRoomCreator) return;
    localStorage.setItem("messageLogs", JSON.stringify(messagesSent));
  }, [messagesSent, isRoomCreator]);

  useEffect(() => {
    socket.on("joinedRoom", (id) => {
      dispatch(setRoomId(id));
    });

    socket.on("userJoined", (name, projectName) => {
      console.log(`${name} has joined!`);
      
      if (!isRoomCreator) return;
      socket.emit("sendInfo", projectName, roomName, JSON.parse(localStorage.getItem("messageLogs")));
    });

    socket.on("getRoomInfo", (roomName, messageLogs) => {
      dispatch(setRoomName(roomName));
      console.log(messageLogs);
      setMessagesSent([...messageLogs]);
    });

    socket.on("recieveMessage", (message) => {
      setMessagesSent([...messagesSent, message]);
    });

    return () => {
      socket.off("joinedRoom");
      socket.off("userJoined");
      socket.off("getRoomInfo");
      socket.off("recieveMessage");
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
                  minHeight: "40vh",
                  width: "94%",
                  background: theColorScheme === "dark" ? "#454bad" : undefined,
                  color: theColorScheme === "dark" ? "#fff" : undefined,
                  borderRadius: "7px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                  overflow: "auto"
                }}
              >
                {messageLogs} 
              </Box>
              <Space h="lg"></Space>
              <Group hidden={!isRoomCreator}>
                <TextInput
                  description="Send Message in Chat"
                  // value={descInput}
                  onChange={(e) => setMessageInput(e.target.value)}
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
            </Box>
            :
            <Box p={8} style={{ minWidth: 240 }}>
              <TextInput
                label="Join by Classroom ID"
                description="Enter the ID of the classroom you want to join"
                // value={nameInput}
                onChange={(e) => setroomIdInput(e.currentTarget.value)}
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
                onChange={(e) => setroomNameInput(e.currentTarget.value)}
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