import { Paper, Group, Text, Tooltip, ActionIcon, Box } from "@mantine/core";
import {
  PiCodeBold,
  PiDotOutlineFill,
  PiArrowCounterClockwiseBold,
  PiArrowClockwiseBold,
  PiFloppyDiskBold,
  PiXBold
} from "react-icons/pi";
import MonacoEditor from "@monaco-editor/react";
import React from "react";

const EditorPane = ({
  MIN_PANE_WIDTH,
  DEFAULT_PANE_WIDTHS,
  width,
  onDragStart,
  onDragOver,
  closePane,
  renderTabBar,
  unsavedFiles,
  activeTab,
  saveCurrentFile,
  editorRef,
  monaco,
  modelsRef,
  getMonacoLang,
  userIsOwner
}) => (
  <Paper
    shadow="xs"
    p={0}
    style={{
      flex: 1,
      minWidth: MIN_PANE_WIDTH,
      maxWidth: 3000,
      width: width || DEFAULT_PANE_WIDTHS.editor,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.1s"
    }}
    draggable
    onDragStart={() => onDragStart("editor")}
    onDragOver={(e) => onDragOver(e, "editor")}
  >
    {renderTabBar()}
    <Group
      align="apart"
      px="sm"
      py="xs"
      style={{ borderBottom: "1px solid #eee" }}
    >
      <Group gap={4}>
        <PiCodeBold />
        {unsavedFiles[activeTab] && (
          <PiDotOutlineFill
            color="#FFA94D"
            style={{ marginRight: 4, fontSize: 16 }}
          />
        )}
        <Text size="sm">{activeTab || "No file selected"}</Text>
      </Group>
      <Tooltip label={"Undo"} position="top">
        <ActionIcon
          variant="subtle"
          onClick={() => {
            if (editorRef.current)
              editorRef.current.trigger("keyboard", "undo", null);
          }}
          size="sm"
          title="Undo"
          disabled={!activeTab}
        >
          <PiArrowCounterClockwiseBold />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={"Redo"} position="top">
        <ActionIcon
          variant="subtle"
          onClick={() => {
            if (editorRef.current)
              editorRef.current.trigger("keyboard", "redo", null);
          }}
          size="sm"
          title="Redo"
          disabled={!activeTab}
        >
          <PiArrowClockwiseBold />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={"Save"} position="top">
        <ActionIcon
          variant="subtle"
          onClick={saveCurrentFile}
          size="sm"
          color="blueButCooler"
          title="Save this file"
        >
          <PiFloppyDiskBold />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={"Close"} position="top">
        <ActionIcon
          variant="subtle"
          onClick={() => closePane("editor")}
          size="sm"
        >
          <PiXBold />
        </ActionIcon>
      </Tooltip>
    </Group>
    <Box style={{ flex: 1, minHeight: 0 }}>
      <MonacoEditor
        key="monaco-singleton"
        theme="vs-light"
        height="100%"
        width="100%"
        language={getMonacoLang(activeTab)}
        options={{
          readOnly: !userIsOwner,
          minimap: { enabled: true },
          fontSize: 14,
          fontFamily: "Fira Mono, monospace"
        }}
        onMount={(editor) => {
          editorRef.current = editor;
          if (monaco && modelsRef.current[activeTab]) {
            editor.setModel(modelsRef.current[activeTab]);
          }
        }}
      />
    </Box>
  </Paper>
);

export default EditorPane;
