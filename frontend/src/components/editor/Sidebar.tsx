import { Box, Tooltip, ActionIcon } from "@mantine/core";
import { PiFilesBold, PiGearBold } from "react-icons/pi";
import React from "react";

const Sidebar = ({ sidebarTab, setSidebarTab, openPane }) => (
  <Box
    style={{
      width: 48,
      minWidth: 48,
      maxWidth: 48,
      height: "100%",
      background: "#f3f4f8",
      borderRight: "1px solid #e0e0e0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 8,
      gap: 4
    }}
  >
    <Tooltip label="Files" position="right">
      <ActionIcon
        color={sidebarTab === "explorer" ? "blueButCooler" : "gray"}
        variant={sidebarTab === "explorer" ? "filled" : "subtle"}
        size="lg"
        onClick={() => {
          setSidebarTab("explorer");
          openPane("explorer");
        }}
        style={{ marginBottom: 4 }}
      >
        <PiFilesBold />
      </ActionIcon>
    </Tooltip>
    <Tooltip label="Settings" position="right">
      <ActionIcon
        color={sidebarTab === "settings" ? "blueButCooler" : "gray"}
        variant={sidebarTab === "settings" ? "filled" : "subtle"}
        size="lg"
        onClick={() => {
          setSidebarTab("settings");
          openPane("settings");
        }}
      >
        <PiGearBold />
      </ActionIcon>
    </Tooltip>
  </Box>
);

export default Sidebar;
