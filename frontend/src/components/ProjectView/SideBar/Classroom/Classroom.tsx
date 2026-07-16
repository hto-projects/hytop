import { PiXBold } from "react-icons/pi";
import { Paper, Group, Text, Box, Button, ActionIcon, TextInput } from "@mantine/core";
import { SIDEBAR_ICON_MAP, SIDEBAR_WIDTH } from "../../constants";
import { useComputedColorScheme } from "@mantine/core";
import { useSelector } from "react-redux";
import { socket } from "../../../../socket";
import { useEffect, useState } from "react";

const Classroom = ({ closePane }) => {
  const [roomID, setRoomID] = useState<null | string>(null);
  const theColorScheme = useComputedColorScheme("light");
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);

  const joinRoomByID = () => {
    socket.emit("joinRoomByID", `${roomID}`);
  };

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
        <Box p={8} style={{ minWidth: 240 }}>
          <TextInput
            label="Join by Classroom ID"
            description="Enter the ID of the classroom you want to join"
            // value={nameInput}
            onChange={(e) => setRoomID(e.currentTarget.value)}
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
            // onChange={(e) => setDescInput(e.currentTarget.value)}
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
              // onClick={handleSave}
              style={{ fontWeight: 600 }}
            >
              Create
            </Button>
          </Group>
        </Box>
      </Box>
    </Paper>
  );
};

export default Classroom;