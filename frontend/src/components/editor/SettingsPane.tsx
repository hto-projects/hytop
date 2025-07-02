import { Paper, Group, Text, Box, ActionIcon } from "@mantine/core";
import { PiGearBold, PiXBold } from "react-icons/pi";
import React from "react";

const SettingsPane = ({
  MIN_PANE_WIDTH,
  DEFAULT_PANE_WIDTHS,
  width,
  onDragStart,
  onDragOver,
  closePane
}) => (
  <Paper
    shadow="xs"
    p={0}
    style={{
      minWidth: MIN_PANE_WIDTH,
      maxWidth: 600,
      width: width || DEFAULT_PANE_WIDTHS.settings,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.1s"
    }}
    draggable
    onDragStart={() => onDragStart("settings")}
    onDragOver={(e) => onDragOver(e, "settings")}
  >
    <Group
      align="apart"
      px="sm"
      py="xs"
      style={{ borderBottom: "1px solid #eee" }}
    >
      <Group gap={4}>
        <PiGearBold />
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
    <Box style={{ flex: 1, minHeight: 0, padding: 16 }}>
      <Text fw={700} mb="sm">
        Project Settings
      </Text>

      <Text c="dimmed" size="sm">
        (settings)
      </Text>
    </Box>
  </Paper>
);

export default SettingsPane;
