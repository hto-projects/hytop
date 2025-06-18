import { Box, ActionIcon } from "@mantine/core";
import {
  PiFileJs,
  PiFileCss,
  PiFileHtml,
  PiDotOutlineFill,
  PiXBold
} from "react-icons/pi";
import React from "react";

const TabBar = ({
  tabs,
  activeTab,
  unsavedFiles,
  handleTabClick,
  handleTabClose
}) => (
  <Box
    style={{
      display: "flex",
      alignItems: "center",
      height: 36,
      borderBottom: "1px solid #eee",
      background: "#f8f8fa"
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
          background: activeTab === fileName ? "#fff" : "transparent",
          borderRight: "1px solid #eee",
          borderTop:
            activeTab === fileName
              ? "2px solid #4f55c6"
              : "2px solid transparent",
          fontWeight: activeTab === fileName ? 600 : 400,
          color: activeTab === fileName ? "#191f5e" : "#444"
        }}
        onClick={() => handleTabClick(fileName)}
      >
        <span style={{ marginRight: 6 }}>
          {fileName.endsWith(".js") && <PiFileJs size={14} />}
          {fileName.endsWith(".css") && <PiFileCss size={14} />}
          {fileName.endsWith(".html") && <PiFileHtml size={14} />}
        </span>
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

export default TabBar;
