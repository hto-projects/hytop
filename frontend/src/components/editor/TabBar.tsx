import { Box, ActionIcon, useComputedColorScheme } from "@mantine/core";
import {
  PiFileJs,
  PiFileCss,
  PiFileHtml,
  PiDotOutlineFill,
  PiXBold
} from "react-icons/pi";
import React from "react";
import { useSelector } from "react-redux";

const TabBar = ({
  tabs,
  activeTab,
  unsavedFiles,
  handleTabClick,
  handleTabClose,
  primaryColor: propPrimaryColor,
  userIsOwner = true
}) => {
  const primaryColor =
    propPrimaryColor || useSelector((state: any) => state.theme.primaryColor);
  const theColorScheme = useComputedColorScheme("light");
  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        height: 36,
        borderBottom:
          theColorScheme === "dark" ? "1px solid #333" : "1px solid #eee",
        background: theColorScheme === "dark" ? "#181A1B" : undefined,
        color: theColorScheme === "dark" ? "white" : undefined
      }}
    >
      {tabs.map((fileName) => (
        <Box
          key={fileName}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            height: "100%",
            cursor: "pointer",
            background:
              activeTab === fileName
                ? theColorScheme === "dark"
                  ? "#23272A"
                  : "#fff"
                : "transparent",
            borderRight:
              theColorScheme === "dark" ? "1px solid #333" : "1px solid #eee",
            borderTop:
              activeTab === fileName
                ? `2px solid ${primaryColor}`
                : "2px solid transparent",
            fontWeight: activeTab === fileName ? 600 : 400,
            color:
              activeTab === fileName
                ? theColorScheme === "dark"
                  ? "#fff"
                  : "#191f5e"
                : theColorScheme === "dark"
                ? "#bbb"
                : "#444"
          }}
          onClick={() => handleTabClick(fileName)}
        >
          <span style={{ marginRight: 6 }}>
            {typeof fileName === "string" && fileName.endsWith(".js") && (
              <PiFileJs size={14} />
            )}
            {typeof fileName === "string" && fileName.endsWith(".css") && (
              <PiFileCss size={14} />
            )}
            {typeof fileName === "string" && fileName.endsWith(".html") && (
              <PiFileHtml size={14} />
            )}
          </span>
          <span style={{ marginRight: 6 }}>{fileName}</span>
          {unsavedFiles[fileName] && (
            <PiDotOutlineFill
              color="#FFA94D"
              style={{ marginRight: 4, fontSize: 14 }}
            />
          )}
          {userIsOwner && (
            <ActionIcon
              variant="subtle"
              size="xs"
              style={{ marginLeft: 2 }}
              onClick={(e) => handleTabClose(fileName, e)}
              title="Close tab"
            >
              <PiXBold size={12} />
            </ActionIcon>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default TabBar;
