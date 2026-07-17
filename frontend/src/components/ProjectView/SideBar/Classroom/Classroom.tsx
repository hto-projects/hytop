import { PiXBold } from "react-icons/pi";
import { Paper, Group, Text, Box, Button, ActionIcon, TextInput, Space } from "@mantine/core";
import { SIDEBAR_ICON_MAP, SIDEBAR_WIDTH } from "../../constants";
import { useComputedColorScheme } from "@mantine/core";
import { useSelector } from "react-redux";
import { socket } from "../../../../socket";
import { useEffect, useState } from "react";
import { useGetProjectQuery } from "../../../../slices/projectsApiSlice";
import { IProjectFile } from "../../../../../../shared/types";
import { useParams } from "react-router-dom";

const Classroom = ({ closePane }) => {
  // marking these four lines to be moved to global state
  // cuz big issue, whenever jumping to the classroom panel and back these things automatically get reset.
  const [roomName, setRoomName] = useState(""); 
  const [roomID, setRoomID] = useState(""); 
  const [isInRoom, setIsInRoom] = useState(false);
  const [isRoomCreator, setIsRoomCreator] = useState(true);
  
  const [roomIDInput, setroomIDInput] = useState("");
  const [roomNameInput, setroomNameInput] = useState("");

  const theColorScheme = useComputedColorScheme("light");
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);

  const { projectName} = useParams();
  // const projectData: {
  //   data?: {
  //     projectId: string;
  //     projectName: string;
  //     projectDescription: string;
  //     projectFiles: IProjectFile[];
  //     ownerUsername: string;
  //   };
  // } = useGetProjectQuery(projectName);

  const joinRoomByID = () => {
    socket.emit("joinRoomByID", roomIDInput, "brian patton", projectName);
    setRoomID(roomIDInput);
    setIsInRoom(true);
  };
  
  const createRoom = () => {
    socket.emit("createRoom");
    setRoomName(roomNameInput);
    setIsInRoom(true);
    setIsRoomCreator(true);
  };

  useEffect(() => {
    socket.on("joinedRoom", (id) => {
      setRoomID(id);
    });

    socket.on("userJoined", (name, projectName) => {
      console.log(`${name} has joined!`);
      console.log(`${isRoomCreator}`);

      if (!isRoomCreator) return;
      socket.emit("privateMessage", projectName, roomName);
    });

    socket.on("getRoomName", (roomName) => {
      setRoomName(roomName)
    });

    return () => {
      socket.off("joinedRoom");
      socket.off("userJoined");
      socket.off("getRoomName");
    };
  }, []);

  return (
    <Paper
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
              <Text size="xs">Room ID: {roomID}</Text>
              <Space h="md"></Space>
              <TextInput
                description="Send Message in Chat"
                // value={descInput}
                // onChange={(e) => setroomNameInput(e.currentTarget.value)}
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
                  // onClick={createRoom}
                  style={{ fontWeight: 600 }}
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
                onChange={(e) => setroomIDInput(e.currentTarget.value)}
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