import { Box, Text, Space, Group, TextInput, Button, Transition, Notification } from "@mantine/core";
import { useComputedColorScheme } from "@mantine/core";
import { useSelector } from "react-redux";
import { handleEnterShortCut } from "../../util";
import { useEffect, useState } from "react";

type ClassroomMessagesPaneProps = {
  messagesSent: string[];
  messageInput: string;
  setMessageInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  leaveRoom: () => void;
};

const ClassroomMessagesPane = ({
  messagesSent,
  messageInput,
  setMessageInput,
  sendMessage,
  leaveRoom,
}: ClassroomMessagesPaneProps) => {
  const [messageLogs, setMessageLogs] = useState<React.JSX.Element[]>([]);
  
  const {
    roomName,
    roomId,
    isRoomCreator,
  } = useSelector((state: any) => state.room);
  const theColorScheme = useComputedColorScheme("light");
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);

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
              padding: "0.2rem 0.5rem",
              maxWidth: "90%",
              width: "max-content",
              color: "white"
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
  
  return (
    <Box p={8} style={{ minWidth: 240 }}>
      <Text size="xs" fw="bold">Welcome to "{roomName}"</Text>
      <Text size="xs">Room Id: {roomId}</Text>
      <Space h="md"></Space>
      <Box
        style={{
          height: "40vh",
          width: "94%",
          background: primaryColor,
          color: theColorScheme === "dark" ? "#fff" : undefined,
          borderRadius: "7px",
          display: "flex",
          flexDirection: "column-reverse",
          overflowY: "auto",
          paddingTop: "0.75rem"
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
        <Button
          size="xs"
          color={primaryColor}
          onClick={leaveRoom}
          style={{ fontWeight: 600, marginTop: "-0.77rem" }}
        >
          Leave Room
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
    </Box>
  );
};

export default ClassroomMessagesPane;