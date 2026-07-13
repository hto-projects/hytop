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
  PiArrowCounterClockwiseBold,
  PiArrowClockwiseBold
} from "react-icons/pi";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_PANE_WIDTHS, MIN_PANE_WIDTH } from "../constants";
import { getMonacoLang } from "../util";
import TabBar from "./TabBar";
import { setProjectFiles, setUnsavedFiles } from "../../../slices/editorSlice";
import { IProjectFile } from "../../../../../shared/types";

const FileEditorComponent = ({
  unsavedFiles,
  editorRef,
  userIsOwner,
  showing,
  modelsRef
}) => {
  // Using Things
  const monaco = useMonaco();
  const theColorScheme: string = useComputedColorScheme("light");
  const dispatch = useDispatch();

  // Loading from Store
  const {
    monacoTheme,
    monacoFont,
    monacoFontSize,
    monacoWordWrap,
    monacoAutocomplete,
    projectFiles,
    activeTab,
    tabs
  }: {
    monacoTheme: string;
    monacoFont: string;
    monacoFontSize: number;
    monacoWordWrap: "on" | "off";
    monacoAutocomplete: boolean;
    projectFiles: any;
    activeTab: any;
    tabs: any;
  } = useSelector((state: any) => state.editor);

  // Component State
  const [editorMounted, setEditorMounted] = useState<Boolean>(false);

  /* Handlers */

  // Called when Editor is loaded
  const handleEditorMount = (editor) => {
    if (editorRef.current && typeof editorRef.current.dispose === "function") {
      try {
        editorRef.current.dispose();
      } catch {
        console.error("Error disposing editor");
      }
    }
    editorRef.current = editor;
    setEditorMounted(true);
  };

  // Called when code changes in the editor
  const handleEditorChange = () => {
    dispatch(setUnsavedFiles({ ...unsavedFiles, [activeTab]: true }));

    const newProjectFiles: IProjectFile[] = [];
    for (let i = 0; i < projectFiles.length; i++) {
      const newFile = { ...projectFiles[i] };
      const activeModel = modelsRef.current[activeTab];
      if (projectFiles[i].fileName === activeTab && activeModel) {
        newFile.fileContent = activeModel.getValue();
      }
      newProjectFiles.push(newFile);
    }

    dispatch(setProjectFiles(newProjectFiles));
  };

  /* Effects */

  // Cleanup editor on unmount
  useEffect(() => {
    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.dispose === "function"
      ) {
        try {
          editorRef.current.dispose();
        } catch {
          console.error("Error disposing editor");
        }
        editorRef.current = null;
      }
    };
  }, [monaco]);

  // When active tab changes, ensure we set the proper current model
  useEffect(() => {
    if (!monaco || !editorRef.current || !modelsRef || !modelsRef.current)
      return;

    const activeModel = modelsRef.current[activeTab];
    if (activeTab && activeModel) {
      const model = activeModel;
      editorRef.current.setModel(model);
      editorRef.current.focus();
      editorRef.current.__lastFile = activeTab;

      const language = getMonacoLang(activeTab);
      monaco.editor.setModelLanguage(model, language);
    }
  }, [activeTab, monaco, editorRef]);

  // When loading a new project, make sure we setup our model
  useEffect(() => {
    if (!monaco || !editorRef.current || !modelsRef) return;

    const currentRefModel = modelsRef.current[activeTab];
    const loadedModel = monaco.editor
      .getModels()
      .find((m) => m.uri.path === `/${activeTab}`);
    const file = projectFiles.find((f) => f.fileName === activeTab);

    if (activeTab && file) {
      if (!currentRefModel) {
        if (loadedModel) {
          loadedModel.dispose();
        }

        const uri = monaco.Uri.parse(`file:///${file.fileName}`);
        const model = monaco.editor.createModel(
          file.fileContent,
          getMonacoLang(file.fileName),
          uri
        );

        modelsRef.current[file.fileName] = model;
        editorRef.current.setModel(model); 
        editorRef.current.onDidScrollChange((e) => localStorage.setItem("scrollTop", e.scrollTop.toString()));
      }
    }
  }, [activeTab, editorMounted, projectFiles]);

  // changes to project files have to be tracked separately from tab switches otherwise 
  // it'll keep the same scroll position across all the tabs when switching
  useEffect(() => {
    if (!editorRef.current || editorRef.current.getScrollTop() === parseInt(localStorage.getItem("scrollTop"))) return;
    
    editorRef.current.setScrollPosition({ scrollTop: parseInt(localStorage.getItem("scrollTop")) });
  }, [projectFiles]);

  return (
    <Paper
      shadow="xs"
      p={0}
      style={{
        flex: 1,
        minWidth: MIN_PANE_WIDTH,
        maxWidth: 3000,
        width: DEFAULT_PANE_WIDTHS.editor,
        height: "100%",
        display: showing ? "flex" : "none",
        flexDirection: "column",
        transition: "width 0.1s",
        color: theColorScheme === "dark" ? "white" : undefined,
        background: theColorScheme === "dark" ? "#181A1B" : "#f3f4f8"
      }}
    >
      <TabBar tabs={tabs} activeTab={activeTab} unsavedFiles={unsavedFiles} />
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
          <Text size="sm">{activeTab || "No file selected"}</Text>
        </Group>
        <Tooltip label={"Undo"} position="top">
          <ActionIcon
            variant="subtle"
            onClick={() => {
              if (editorRef.current) {
                editorRef.current.trigger("keyboard", "undo", null);
              }
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
            flex: "1 1 100%",
            minHeight: 0
          }}
        >
          <MonacoEditor
            key="monaco-singleton"
            theme={monacoTheme}
            height="100%"
            width="100%"
            options={{
              readOnly: !userIsOwner,
              minimap: { enabled: true },
              fontSize: monacoFontSize,
              fontFamily: monacoFont,
              wordWrap: monacoWordWrap || "off",

              // toggle autocomplete
              wordBasedSuggestions: monacoAutocomplete ? "allDocuments" : "off",
              suggestOnTriggerCharacters: monacoAutocomplete,
              quickSuggestions: {
                other: monacoAutocomplete,
                comments: monacoAutocomplete,
                strings: monacoAutocomplete
              },
              parameterHints: {
                enabled: monacoAutocomplete
              },
              snippetSuggestions: monacoAutocomplete ? "top" : "none",
              suggest: {
                showWords: monacoAutocomplete
              },

              fontLigatures: false,
              letterSpacing: 0
            }}
            onMount={handleEditorMount}
            onChange={handleEditorChange}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default FileEditorComponent;
