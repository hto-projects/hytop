import { Box, Group, TextInput, Button, Text, Space } from "@mantine/core";
import { useComputedColorScheme } from "@mantine/core";
import { useSelector } from "react-redux";
import { handleEnterShortCut } from "../../util";
import { Classroom } from "../../../../../../shared/types";
import React from "react";

type ClassroomJoinPaneProps = {
  roomIdFromInput: React.MutableRefObject<string>;
  setRoomNameInput: React.Dispatch<React.SetStateAction<string>>;
  rooms: Classroom[];
  joinRoomById: () => void;
  createRoom: () => void;
};

const ClassroomJoinPane = ({
  roomIdFromInput,
  setRoomNameInput,
  rooms,
  joinRoomById,
  createRoom,
}: ClassroomJoinPaneProps) => {
  const theColorScheme = useComputedColorScheme("light");
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);

  const roomElements = rooms.map((room) => {
    return (
      <Button 
        variant="outline" 
        onClick={() => {
          roomIdFromInput.current = room.id;
          joinRoomById();
        }}
      >
        {room.name}
      </Button>
    );
  });

  return (
    <Box p={8} style={{ minWidth: 240 }}>
      <TextInput
        label="Join by Classroom ID"
        description="Enter the ID of the classroom you want to join"
        onChange={(e) => roomIdFromInput.current = e.currentTarget.value}
        onKeyDown={(e) => handleEnterShortCut(e, joinRoomById)}
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
        onClick={joinRoomById}
        style={{ fontWeight: 600 }}
      >
        Join
      </Button>
      <TextInput
        label="Create a Room"
        description="Give your classroom a name"
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
      <Space h="md"></Space>
      <Text size="sm" fw="bold">Join Rooms</Text>
      <Space h="md"></Space>
      <Group>
        {
          roomElements.length > 0 ?
            roomElements : <Text c="dimmed" size="xs">No rooms to join yet! Wait for the instructor to make a room.</Text>
        }
      </Group>
    </Box>
  );
};

export default ClassroomJoinPane;