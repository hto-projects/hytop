import { Box, Text, Space, Group, TextInput, Button, HoverCard, Tooltip } from "@mantine/core";
import { useComputedColorScheme } from "@mantine/core";
import { useSelector } from "react-redux";
import { handleEnterShortCut } from "../../util";
import { useEffect, useState } from "react";
import { PiCopyBold, PiDoorOpenBold, PiXBold } from "react-icons/pi";
import { modals } from "@mantine/modals";

type ClassroomMessagesPaneProps = {
  messagesSent: string[];
  messageInput: string;
  setMessageInput: React.Dispatch<React.SetStateAction<string>>;
  participants: string[];
  sendMessage: () => void;
  leaveRoom: () => void;
  closeRoom: () => void;
};

const ClassroomMessagesPane = ({
  messagesSent,
  messageInput,
  setMessageInput,
  sendMessage,
  leaveRoom,
  closeRoom,
  participants
}: ClassroomMessagesPaneProps) => {
  const [messageLogs, setMessageLogs] = useState<React.JSX.Element[]>([]);
  
  const {
    roomName,
    roomId,
    isRoomCreator,
  } = useSelector((state: any) => state.room);
  const theColorScheme = useComputedColorScheme("light");
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);

  const [showParticipants, setShowParticipants] = useState(false);
  const participantsElements = participants.map((name) => {
    return (<Text size="xs">{ name }</Text>);
  });

  const openModal = () => modals.openConfirmModal({
    title: "Hey hey hey!",
    cancelProps: { color: "red", variant: "light" },
    confirmProps: { color: "green" },
    children: (
      <Text size="sm">Are you sure that you want to delete this room? This action cannot be undone!</Text> 
    ),
    labels: { confirm: 'Confirm', cancel: 'Cancel' },
    onCancel: () => console.log('Cancel'),
    onConfirm: () => closeRoom(),
    style: {
      color: theColorScheme === "light" ? "black" : "white"
    }
  });

  useEffect(() => {
    const messages = messagesSent
      .map((message, index) => {
        return (
          <Group ml="xs" mb="xs">
            <HoverCard position="right" openDelay={500}>
              <HoverCard.Target>
                <Text 
                  key={index}
                  fz="xs" 
                  ff="monospace"
                  style={{
                    maxWidth: "90%",
                    width: "max-content",
                    padding: "0.2rem 0.5rem",
                    margin: "auto 0",

                    background: "rgba(0, 0, 0, 0.2)",
                    borderRadius: "6px",
                    color: "white",
                    wordWrap: "break-word",
                  }}
                >
                  {message}
                </Text>
              </HoverCard.Target>
              <HoverCard.Dropdown
                style={{
                  color: theColorScheme === "dark" ? "#fff" : "#000",
                  background: "transparent",
                  border: "none",
                }} 
              >
                <Button 
                  onClick={() => navigator.clipboard.writeText(message)}
                  style={{ 
                    marginLeft: "-10px", 
                    marginBottom: "2px",
                    padding: "0", 
                    background: "rgba(0, 0, 0, 0.2)",
                    height: "20px",
                    width: "20px",
                  }}
                >
                  <PiCopyBold />
                </Button>
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>
        );
      })
      .reverse();
    setMessageLogs(messages);

    if (!isRoomCreator) return;
    localStorage.setItem("messageLogs", JSON.stringify(messagesSent));
  }, [messagesSent, isRoomCreator]);
  
  return (
    <Box p={8} style={{ minWidth: 240 }}>
      <Group
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}
      >
        <Group
          style={{
            display: "block",
            maxWidth: "40%", 
            wordBreak: "break-word",
          }}
        >
          <Text size="xs" fw="bold">Welcome to "{roomName}"</Text>
          <Text size="xs">Room Id: {roomId}</Text>
        </Group>
        <Group>
          <Tooltip openDelay={500} label="Leave Room">
            <Button
              size="xs"
              color={primaryColor}
              onClick={leaveRoom}
              style={{ fontWeight: 600 }}
              variant="light"
            >
              <PiDoorOpenBold />
            </Button>
          </Tooltip>
          <Tooltip openDelay={500} label="Close Room">
            <Button
              hidden={!isRoomCreator}
              size="xs"
              color={primaryColor}
              onClick={openModal}
              style={{ fontWeight: 600 }}
              variant="light"
            >
              <PiXBold />
            </Button>
          </Tooltip>
        </Group>
      </Group>
      <Box hidden={!isRoomCreator}>
        <Space h="md"></Space>
        <Group>
          <Button 
            size="xs" 
            onClick={() => setShowParticipants(!showParticipants)}
          >
            All Participants
          </Button>
          <Text 
            ff="monospace" 
            style={{ 
              marginLeft: "auto", 
              padding: "0 1rem" 
            }}
          >
            { participants.length }
          </Text>
        </Group>
        <Space hidden={!showParticipants} h="md"></Space>
        <Box 
          hidden={!showParticipants}
          style={{ 
            maxHeight: "150px",
            overflow: "auto",
          }}
        >
          { participantsElements }
        </Box>
      </Box>
      <Space h="md"></Space>
      <Box
        style={{
          height: "40vh",
          minHeight: "300px",
          width: "100%",
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
      </Group>
    </Box>
  );
};

export default ClassroomMessagesPane;