import {
  Paper,
  Group,
  Text,
  Tooltip,
  ActionIcon,
  Box,
  useComputedColorScheme
} from "@mantine/core";
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
import { useSelector } from "react-redux";

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
}) => {
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  const monacoTheme = useSelector((state: any) => state.editor.monacoTheme);
  const monacoFont = useSelector((state: any) => state.editor.monacoFont);
  const monacoFontSize = useSelector(
    (state: any) => state.editor.monacoFontSize
  );
  const theColorScheme = useComputedColorScheme("light");
  return (
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
        transition: "width 0.1s",
        color: theColorScheme === "dark" ? "white" : undefined,
        background: theColorScheme === "dark" ? "#181A1B" : "#f3f4f8"
      }}
      draggable
      onDragStart={() => onDragStart("editor")}
      onDragOver={(e) => onDragOver(e, "editor")}
    >
      {renderTabBar(primaryColor)}
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
            color={primaryColor}
            title="Save this file"
          >
            <PiFloppyDiskBold color={primaryColor} />
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
          theme={monacoTheme}
          height="100%"
          width="100%"
          language={getMonacoLang(activeTab)}
          options={{
            readOnly: !userIsOwner,
            minimap: { enabled: true },
            fontSize: monacoFontSize,
            fontFamily: monacoFont
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
};

export default EditorPane;
