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
import { initVimMode } from "monaco-vim";

function setupMonacoModels({
  monaco,
  editorRef,
  modelsRef,
  projectFiles,
  activeTab,
  getMonacoLang
}) {
  if (!monaco || !editorRef.current || !activeTab) return;
  projectFiles.forEach((file) => {
    const uri = monaco.Uri.parse(`file:///${file.fileName}`);
    let model = modelsRef.current[file.fileName];
    if (
      !model ||
      (typeof model.isDisposed === "function" && model.isDisposed())
    ) {
      model = monaco.editor.createModel(
        file.fileContent || "",
        getMonacoLang(file.fileName),
        uri
      );
      modelsRef.current[file.fileName] = model;
    } else if (
      model.getValue() !== file.fileContent &&
      file.fileContent !== ""
    ) {
      model.setValue(file.fileContent);
    }
  });

  const filey = projectFiles.find((f) => f.fileName === activeTab);
  const fileContent = filey ? filey.fileContent || "" : "";
  const uri = monaco.Uri.parse(`file:///${activeTab}`);
  let model = modelsRef.current[activeTab];

  if (
    !model ||
    (typeof model.isDisposed === "function" && model.isDisposed())
  ) {
    model = monaco.editor.createModel(
      fileContent,
      getMonacoLang(activeTab),
      uri
    );
    modelsRef.current[activeTab] = model;
  } else if (model.getValue() !== fileContent && fileContent !== "") {
    model.setValue(fileContent);
  }

  if (typeof model.isDisposed !== "function" || !model.isDisposed()) {
    if (editorRef.current.getModel() !== model) {
      editorRef.current.setModel(model);
    }
  }
}

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
  userIsOwner,
  projectFiles = []
}) => {
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  const monacoTheme = useSelector((state: any) => state.editor.monacoTheme);
  const monacoFont = useSelector((state: any) => state.editor.monacoFont);
  const monacoFontSize = useSelector(
    (state: any) => state.editor.monacoFontSize
  );
  const monacoWordWrap = useSelector(
    (state: any) => state.editor.monacoWordWrap
  );
  const vimModeEnabled = useSelector((state: any) => state.editor.vimMode);
  const theColorScheme = useComputedColorScheme("light");

  const vimStatusRef = React.useRef<HTMLDivElement>(null);
  const vimModeRef = React.useRef<any>(null);

  const handleEditorMount = (editor) => {
    if (editorRef.current && typeof editorRef.current.dispose === "function") {
      try {
        editorRef.current.dispose();
      } catch {}
    }
    editorRef.current = editor;
    setupMonacoModels({
      monaco,
      editorRef,
      modelsRef,
      projectFiles,
      activeTab,
      getMonacoLang
    });

    if (vimModeRef.current) {
      vimModeRef.current.dispose();
      vimModeRef.current = null;
    }
    if (vimModeEnabled && editor && vimStatusRef.current) {
      vimModeRef.current = initVimMode(editor, vimStatusRef.current);
    }
  };

  React.useEffect(() => {
    if (!editorRef.current) return;
    if (vimModeRef.current) {
      vimModeRef.current.dispose();
      vimModeRef.current = null;
    }
    if (vimModeEnabled && vimStatusRef.current) {
      vimModeRef.current = initVimMode(editorRef.current, vimStatusRef.current);
    }
    return () => {
      if (vimModeRef.current) {
        vimModeRef.current.dispose();
        vimModeRef.current = null;
      }
    };
  }, [vimModeEnabled, editorRef.current]);

  React.useEffect(() => {
    setupMonacoModels({
      monaco,
      editorRef,
      modelsRef,
      projectFiles,
      activeTab,
      getMonacoLang
    });
  }, [
    monaco,
    activeTab,
    projectFiles.map((meow) => meow.fileName).join(","),
    projectFiles.map((meow) => meow.fileContent).join("||")
  ]);

  React.useEffect(() => {
    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.dispose === "function"
      ) {
        try {
          editorRef.current.dispose();
        } catch {}
        editorRef.current = null;
      }
    };
  }, [monaco]);

  // incredible fix
  React.useEffect(() => {
    if (!monaco || !editorRef.current) return;
    const isComicMono =
      monacoFont &&
      (monacoFont.includes("Comic Mono") ||
        monacoFont.includes("'Comic Mono'"));
    if (isComicMono && document.fonts) {
      document.fonts.load('16px "Comic Mono"').then(() => {
        if (monaco && monaco.editor && monaco.editor.remeasureFonts) {
          monaco.editor.remeasureFonts();
        }
        if (editorRef.current && editorRef.current.layout) {
          editorRef.current.layout();
        }
      });
    }
  }, [monaco, monacoFont, editorRef.current]);

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
      // draggable
      // onDragStart={() => onDragStart("editor")}
      // onDragOver={(e) => onDragOver(e, "editor")}
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
      <Box
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
      >
        <Box
          style={{
            flex: vimModeEnabled ? "1 1 calc(100% - 24px)" : "1 1 100%",
            minHeight: 0
          }}
        >
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
              fontFamily: monacoFont,
              wordWrap: monacoWordWrap || "off",
              fontLigatures: false,
              letterSpacing: 0
            }}
            onMount={handleEditorMount}
          />
        </Box>
        {vimModeEnabled && (
          <div
            ref={vimStatusRef}
            style={{
              height: 24,
              minHeight: 24,
              maxHeight: 24,
              boxSizing: "border-box",
              background: theColorScheme === "dark" ? "#23272A" : "#f3f4f8",
              color: theColorScheme === "dark" ? "#fff" : "#222",
              fontFamily: "monospace",
              fontSize: 13,
              padding: "2px 8px",
              overflow: "hidden",
              flex: "0 0 24px"
            }}
          />
        )}
      </Box>
    </Paper>
  );
};

export default EditorPane;
