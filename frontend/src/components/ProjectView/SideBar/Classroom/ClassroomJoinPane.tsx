import { Box, Group, TextInput, Button } from "@mantine/core";
import { useComputedColorScheme } from "@mantine/core";
import { useSelector } from "react-redux";
import { handleEnterShortCut } from "../../util";

type ClassroomJoinPaneProps = {
  setRoomIdInput: React.Dispatch<React.SetStateAction<string>>;
  setRoomNameInput: React.Dispatch<React.SetStateAction<string>>;
  joinRoomById: () => void;
  createRoom: () => void;
};

const ClassroomJoinPane = ({
  setRoomIdInput,
  joinRoomById,
  setRoomNameInput,
  createRoom,
}: ClassroomJoinPaneProps) => {
  const theColorScheme = useComputedColorScheme("light");
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);

  return (
    <Box p={8} style={{ minWidth: 240 }}>
      <TextInput
        label="Join by Classroom ID"
        description="Enter the ID of the classroom you want to join"
        onChange={(e) => setRoomIdInput(e.currentTarget.value)}
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
    </Box>
  );
};

export default ClassroomJoinPane;