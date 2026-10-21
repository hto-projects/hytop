import {
  Paper,
  Group,
  Text,
  Box,
  ActionIcon
} from "@mantine/core";
import {
  PiXBold,
} from "react-icons/pi";

import { useComputedColorScheme } from "@mantine/core";
import { SIDEBAR_ICON_MAP, SIDEBAR_WIDTH } from "../../constants";
import AddImpressionWidget from "../../../Util/AddImpressionWidget";

const UtilPane = ({ closePane, hidden }) => {
  const theColorScheme = useComputedColorScheme("light");
  return (
    <Paper
      hidden={hidden}
      shadow="xs"
      p={0}
      style={{
        maxWidth: 600,
        width: SIDEBAR_WIDTH,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.1s",
        color: "white",
        backgroundColor: "black",
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
          {SIDEBAR_ICON_MAP["Util"]}
          <Text size="sm">Impressions</Text>
        </Group>
        <ActionIcon
          variant="subtle"
          onClick={() => closePane("preferences")}
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
        <AddImpressionWidget />
      </Box>
    </Paper>
  );
};

export default UtilPane;
