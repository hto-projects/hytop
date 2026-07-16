import { Paper, Group, Text, Box, Button, ActionIcon, useComputedColorScheme, TextInput } from "@mantine/core";
import { SIDEBAR_ICON_MAP, SIDEBAR_WIDTH } from "../../constants";
import { PiXBold } from "react-icons/pi";
import { useSelector } from "react-redux";

const Classroom = ({ closePane }) => {
  const theColorScheme = useComputedColorScheme("light");
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  
  return (
    <Paper
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
          {SIDEBAR_ICON_MAP["Classroom"]}
          <Text size="sm">Classroom</Text>
        </Group>
        <ActionIcon
          variant="subtle"
          onClick={() => closePane("Classroom")}
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
            label="Classroom ID"
            // value={descInput}
            // onChange={(e) => setDescInput(e.currentTarget.value)}
            description="Please enter the ID of the classroom you intend to join"
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
              Join
            </Button>
          </Group>
        </Box>
      </Box>
    </Paper>
  );
};

export default Classroom;