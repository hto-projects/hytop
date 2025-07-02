import {
  Box,
  Tooltip,
  ActionIcon,
  useComputedColorScheme
} from "@mantine/core";
import { PiFilesBold, PiGearBold } from "react-icons/pi";
import React from "react";
import { useSelector } from "react-redux";

const Sidebar = ({ sidebarTab, setSidebarTab, openPane }) => {
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  const theColorScheme = useComputedColorScheme("light");
  return (
    <Box
      style={{
        width: 48,
        minWidth: 48,
        maxWidth: 48,
        height: "100%",
        background: theColorScheme === "dark" ? "#181A1B" : "#f3f4f8",
        borderRight:
          theColorScheme === "dark" ? "1px solid #333" : "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 8,
        gap: 4,
        color: theColorScheme === "dark" ? "white" : undefined,
        boxShadow: theColorScheme === "dark" ? "2px 0 0 0 #181A1B" : undefined
      }}
    >
      <Tooltip label="Files" position="right">
        <ActionIcon
          color={sidebarTab === "explorer" ? primaryColor : "gray"}
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
          color={sidebarTab === "settings" ? primaryColor : "gray"}
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
};

export default Sidebar;
