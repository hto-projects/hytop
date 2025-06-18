import { Group, Box, Text, Menu, ActionIcon, TextInput } from "@mantine/core";
import {
  PiFilesBold,
  PiFilePlusBold,
  PiFileHtml,
  PiFileCss,
  PiFileJs,
  PiXBold,
  PiDotOutlineFill
} from "react-icons/pi";
import React from "react";

const ExplorerPane = ({
  MIN_PANE_WIDTH,
  DEFAULT_PANE_WIDTHS,
  width,
  onDragStart,
  onDragOver,
  closePane,
  addFile,
  projectFiles,
  selectedFile,
  handleFileSelect,
  startRename,
  unsavedFiles,
  renamingFile,
  renameValue,
  dispatch,
  setRenameValue,
  confirmRename,
  cancelRename
}) => (
  <Box
    p={0}
    style={{
      minWidth: MIN_PANE_WIDTH,
      maxWidth: 3000,
      width: width || DEFAULT_PANE_WIDTHS.explorer,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.1s"
    }}
    draggable
    onDragStart={() => onDragStart("explorer")}
    onDragOver={(e) => onDragOver(e, "explorer")}
  >
    <Group
      align="apart"
      px="sm"
      py="xs"
      style={{ borderBottom: "1px solid #eee" }}
    >
      <Group gap={4}>
        <PiFilesBold />
        <Text size="sm">Files</Text>
      </Group>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon variant="subtle" size="sm">
            <PiFilePlusBold />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Add New File</Menu.Label>
          <Menu.Item
            leftSection={<PiFileHtml size={14} />}
            onClick={() => addFile("html")}
          >
            HTML
          </Menu.Item>
          <Menu.Item
            leftSection={<PiFileCss size={14} />}
            onClick={() => addFile("css")}
          >
            CSS
          </Menu.Item>
          <Menu.Item
            leftSection={<PiFileJs size={14} />}
            onClick={() => addFile("js")}
          >
            JavaScript
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <ActionIcon
        variant="subtle"
        onClick={() => closePane("explorer")}
        size="sm"
      >
        <PiXBold />
      </ActionIcon>
    </Group>
    <Box style={{ flex: 1, overflowY: "auto" }}>
      {projectFiles.map((file) => (
        <Box
          key={file.fileName}
          px="sm"
          py={6}
          style={{
            cursor: "pointer",
            background: selectedFile === file.fileName ? "#f3f3f3" : undefined,
            fontWeight: selectedFile === file.fileName ? 600 : 400,
            display: "flex",
            alignItems: "center"
          }}
          onClick={() => handleFileSelect(file.fileName)}
          onDoubleClick={() => startRename(file.fileName)}
        >
          {unsavedFiles[file.fileName] && (
            <PiDotOutlineFill
              color="#FFA94D"
              style={{ marginRight: 6, fontSize: 16 }}
            />
          )}
          {renamingFile === file.fileName ? (
            <TextInput
              value={renameValue}
              onChange={(e) => dispatch(setRenameValue(e.currentTarget.value))}
              size="xs"
              autoFocus
              onBlur={confirmRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmRename();
                else if (e.key === "Escape") cancelRename();
              }}
              styles={{
                input: {
                  padding: "2px 6px",
                  fontSize: "14px",
                  height: "24px",
                  minWidth: "80px"
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            file.fileName
          )}
        </Box>
      ))}
    </Box>
  </Box>
);

export default ExplorerPane;
