import { Box, ActionIcon, useComputedColorScheme } from "@mantine/core";
import {
  PiFileJs,
  PiFileCss,
  PiFileHtml,
  PiImageBold,
  PiDotOutlineFill,
  PiXBold
} from "react-icons/pi";
import React from "react";
import { useSelector } from "react-redux";

const getFileExtension = (fileName?: string) => {
  if (!fileName) return "";
  const splitName = fileName.split(".");
  if (splitName.length < 2) return "";
  return splitName[splitName.length - 1].toLowerCase();
};

const getTabIcon = (fileName?: string) => {
  const ext = getFileExtension(fileName);
  switch (ext) {
    case "css":
      return <PiFileCss size={14} />;
    case "html":
      return <PiFileHtml size={14} />;
    case "js":
      return <PiFileJs size={14} />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
    case "svg":
      return <PiImageBold size={14} />;
    default:
      return null;
  }
};

const TabBar = ({
  tabs,
  activeTab,
  unsavedFiles,
  handleTabClick,
  handleTabClose,
  primaryColor: propPrimaryColor
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
          <span style={{ marginRight: 6 }}>{getTabIcon(fileName)}</span>
          <span style={{ marginRight: 6 }}>{fileName}</span>
          {unsavedFiles[fileName] && (
            <PiDotOutlineFill
              color="#FFA94D"
              style={{ marginRight: 4, fontSize: 14 }}
            />
          )}
          <ActionIcon
            variant="subtle"
            size="xs"
            style={{ marginLeft: 2 }}
            onClick={(e) => handleTabClose(fileName, e)}
            title="Close tab"
          >
            <PiXBold size={12} />
          </ActionIcon>
        </Box>
      ))}
    </Box>
  );
};

export default TabBar;
