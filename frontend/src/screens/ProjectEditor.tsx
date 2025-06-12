import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  useCheckOwnershipQuery,
  useGetProjectQuery,
  useUpdateProjectMutation
} from "../slices/projectsApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  ActionIcon,
  Group,
  Tooltip,
  Box,
  Loader,
  Text,
  Paper,
  TextInput,
  Menu
} from "@mantine/core";
import {
  PiFilesBold,
  PiCodeBold,
  PiMonitorBold,
  PiFloppyDiskBold,
  PiCopyBold,
  PiXBold,
  PiFilePlusBold,
  PiFileCss,
  PiFileHtml,
  PiFileJs,
  PiGearBold,
  PiDotOutlineFill
} from "react-icons/pi";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import {
  setPaneState,
  setSelectedFile,
  setProjectFiles,
  setProjectVersion,
  setRenameFile,
  setRenamingFile,
  setRenameValue,
  setTabs,
  setActiveTab,
  openTab,
  closeTab,
  syncTabsWithFiles
} from "../slices/editorSlice";
import { IProject } from "../../../shared/types";

import { RootState } from "../store";
import { set } from "mongoose";

// TODO: this file is a mess and some stuff needs to be moved to their own individual components

const paneTypes = [
  { key: "explorer", icon: <PiFilesBold />, label: "Files" },
  { key: "editor", icon: <PiCodeBold />, label: "Editor" },
  { key: "preview", icon: <PiMonitorBold />, label: "Preview" },
  { key: "settings", icon: <PiGearBold />, label: "Settings" }
];

const DEFAULT_PANE_WIDTHS = {
  explorer: 200,
  editor: 600,
  preview: 400,
  settings: 320
};

const MIN_PANE_WIDTH = 60;
const ProjectEditor = () => {
  const [sidebarTab, setSidebarTab] = React.useState<"explorer" | "settings">(
    "explorer"
  );
  const { projectName } = useParams();
  const dispatch = useDispatch();
  const ownership: any = useCheckOwnershipQuery(projectName);
  const projectData: any = useGetProjectQuery(projectName);
  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  const {
    paneState,
    selectedFile,
    projectFiles,
    projectVersion,
    renamingFile,
    renameValue,
    tabs,
    activeTab
  } = useSelector((state: RootState) => state.editor);

  const userIsOwner = true;

  const [unsavedFiles, setUnsavedFiles] = React.useState<{
    [filename: string]: boolean;
  }>({});

  useEffect(() => {
    const initialUnsaved: { [filename: string]: boolean } = {};
    projectFiles.forEach((f) => {
      initialUnsaved[f.fileName] = false;
    });
    setUnsavedFiles(initialUnsaved);
    dispatch(syncTabsWithFiles());
  }, [projectFiles.length, projectFiles.map((f) => f.fileName).join(",")]);

  useEffect(() => {
    if (projectData?.data) {
      dispatch(setProjectFiles(projectData.data.projectFiles));
      if (tabs.length === 0 && projectData.data.projectFiles.length > 0) {
        const firstFile = projectData.data.projectFiles[0].fileName;
        dispatch(setTabs([firstFile]));
        dispatch(setActiveTab(firstFile));
      }
    }
  }, [projectData?.data]);

  useEffect(() => {
    if (!paneState.order.includes("settings")) {
      dispatch(
        setPaneState({
          ...paneState,
          order: [...paneState.order, "settings"],
          open: { ...paneState.open, settings: false }
        })
      );
    }
  }, []);

  const [dragged, setDragged] = React.useState<string | null>(null);

  const onDragStart = (pane: string) => setDragged(pane);
  const onDragOver = (e: React.DragEvent, pane: string) => {
    e.preventDefault();
    if (dragged && dragged !== pane) {
      const newOrder = [...paneState.order];
      const fromIdx = newOrder.indexOf(dragged);
      const toIdx = newOrder.indexOf(pane);
      newOrder.splice(fromIdx, 1);
      newOrder.splice(toIdx, 0, dragged);
      dispatch(setPaneState({ ...paneState, order: newOrder }));
    }
  };

  const closePane = (pane: string) => {
    dispatch(
      setPaneState({
        ...paneState,
        open: { ...paneState.open, [pane]: false }
      })
    );
  };

  const openPane = (pane: string) => {
    dispatch(
      setPaneState({
        ...paneState,
        open: { ...paneState.open, [pane]: true }
      })
    );
  };

  const handleTabClick = (fileName: string) => {
    dispatch(setActiveTab(fileName));
  };

  const handleTabClose = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(closeTab(fileName));
  };

  const handleFileSelect = (filename: string) => {
    dispatch(openTab(filename));
  };

  const startRename = (filename: string) => {
    dispatch(setRenamingFile(filename));
    dispatch(setRenameValue(filename));
  };

  const confirmRename = () => {
    if (
      renameValue &&
      renameValue !== renamingFile &&
      !projectFiles.some((f) => f.fileName === renameValue)
    ) {
      dispatch(setRenameFile({ oldName: renamingFile, newName: renameValue }));
    }
    dispatch(setRenamingFile(null));
    dispatch(setRenameValue(""));
  };

  const cancelRename = () => {
    dispatch(setRenamingFile(null));
    dispatch(setRenameValue(""));
  };

  const addFile = (type: "html" | "css" | "js") => {
    let ext = "";
    let content = "";
    switch (type) {
      case "html":
        ext = "html";
        content = "";
        break;
      case "css":
        ext = "css";
        content = "";
        break;
      case "js":
        ext = "js";
        content = "";
        break;
      default:
        ext = "txt";
        content = "";
    }
    dispatch(
      setProjectFiles([
        ...projectFiles,
        {
          fileName: `new-file-${Date.now()}.${ext}`,
          fileContent: content
        }
      ])
    );
  };

  /*
  const handleFileEdit = (newContent: string) => {
    if (!selectedFile) return;
    const updatedFiles = projectFiles.map((file) =>
      file.fileName === selectedFile
        ? { ...file, fileContent: newContent }
        : file
    );
    dispatch(setProjectFiles(updatedFiles));
    setUnsavedFiles((prev) => ({
      ...prev,
      [selectedFile]: true
    }));
  };
  */

  const save = async () => {
    try {
      await updateProject({ projectFiles, projectName }).unwrap();
      dispatch(setProjectVersion(projectVersion + 1));
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  const monaco = useMonaco();
  const editorRef = useRef<any>(null);
  const modelsRef = useRef<{ [filename: string]: any }>({});
  const viewStatesRef = useRef<{ [filename: string]: any }>({});

  useEffect(() => {
    if (!monaco) return;
    Object.keys(modelsRef.current).forEach((fname) => {
      if (!projectFiles.find((f) => f.fileName === fname)) {
        modelsRef.current[fname]?.dispose();
        delete modelsRef.current[fname];
        delete viewStatesRef.current[fname];
      }
    });
    projectFiles.forEach((file) => {
      if (!modelsRef.current[file.fileName]) {
        const uri = monaco.Uri.parse(`file:///${file.fileName}`);
        const model = monaco.editor.createModel(
          file.fileContent,
          getMonacoLang(file.fileName),
          uri
        );
        modelsRef.current[file.fileName] = model;
        viewStatesRef.current[file.fileName] = null;
      } else {
        const model = modelsRef.current[file.fileName];
        if (model && model.getValue() !== file.fileContent) {
          model.setValue(file.fileContent);
        }
      }
    });
  }, [
    monaco,
    projectFiles.map((f) => f.fileName).join(","),
    projectFiles.map((f) => f.fileContent).join("||")
  ]);

  useEffect(() => {
    if (!monaco || !editorRef.current) return;

    const prev = editorRef.current.__lastFile;
    if (prev && modelsRef.current[prev]) {
      viewStatesRef.current[prev] = editorRef.current.saveViewState();
    }

    if (activeTab && modelsRef.current[activeTab]) {
      const model = modelsRef.current[activeTab];
      editorRef.current.setModel(model);
      if (viewStatesRef.current[activeTab]) {
        editorRef.current.restoreViewState(viewStatesRef.current[activeTab]);
      }
      editorRef.current.focus();
      editorRef.current.__lastFile = activeTab;

      const language = getMonacoLang(activeTab);
      monaco.editor.setModelLanguage(model, language);
    }
  }, [activeTab, monaco]);

  useEffect(() => {
    if (!monaco) return;

    Object.values(modelsRef.current).forEach((model: any) => {
      if (model.__listener) {
        model.__listener.dispose();
        model.__listener = null;
      }
    });

    Object.entries(modelsRef.current).forEach(([fname, model]) => {
      model.__listener = model.onDidChangeContent(() => {
        const content = model.getValue();
        const reduxFile = projectFiles.find((f) => f.fileName === fname);
        if (reduxFile && reduxFile.fileContent !== content) {
          if (fname === activeTab) {
            const updatedFiles = projectFiles.map((f) =>
              f.fileName === fname ? { ...f, fileContent: content } : f
            );
            dispatch(setProjectFiles(updatedFiles));
            setUnsavedFiles((prev) => ({
              ...prev,
              [fname]: true
            }));
          }
        }
      });
    });

    return () => {
      Object.values(modelsRef.current).forEach((model: any) => {
        if (model.__listener) {
          model.__listener.dispose();
          model.__listener = null;
        }
      });
    };
  }, [monaco, activeTab, projectFiles.map((f) => f.fileName).join(",")]);

  const saveCurrentFile = async () => {
    if (!activeTab) return;
    const model = modelsRef.current[activeTab];
    if (!model) return;
    const content = model.getValue();
    const updatedFiles = projectFiles.map((f) =>
      f.fileName === activeTab ? { ...f, fileContent: content } : f
    );
    try {
      await updateProject({ projectFiles: updatedFiles, projectName }).unwrap();
      dispatch(setProjectVersion(projectVersion + 1));
      setUnsavedFiles((prev) => ({
        ...prev,
        [activeTab]: false
      }));
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  /*
  const copy = () => {
  };
  */

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveCurrentFile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [userIsOwner, projectFiles, projectName, projectVersion]);

  // honestly idk this barely works
  const [paneWidths, setPaneWidths] = React.useState(() => ({
    ...DEFAULT_PANE_WIDTHS
  }));
  const paneOrder = paneState.order.filter((p) => paneState.open[p]);

  const closedPanes = paneTypes.filter((p) => !paneState.open[p.key]);
  // const openPanes = paneState.order.filter((p) => paneState.open[p]);

  const resizingRef = React.useRef<{
    idx: number;
    startX: number;
    startWidths: number[];
  } | null>(null);

  const onResizerMouseDown = (idx: number, e: React.MouseEvent) => {
    resizingRef.current = {
      idx,
      startX: e.clientX,
      startWidths: paneOrder.map((p) => paneWidths[p] || DEFAULT_PANE_WIDTHS[p])
    };
    document.addEventListener("mousemove", onResizerMouseMove);
    document.addEventListener("mouseup", onResizerMouseUp);
  };

  const onResizerMouseMove = (e: MouseEvent) => {
    if (!resizingRef.current) return;
    const { idx, startX, startWidths } = resizingRef.current;
    const delta = e.clientX - startX;
    const leftPane = paneOrder[idx];
    const rightPane = paneOrder[idx + 1];

    const totalWidth = startWidths[idx] + startWidths[idx + 1];

    let newLeft = startWidths[idx] + delta;
    let newRight = startWidths[idx + 1] - delta;

    if (newLeft < MIN_PANE_WIDTH) {
      newLeft = MIN_PANE_WIDTH;
      newRight = totalWidth - MIN_PANE_WIDTH;
    } else if (newRight < MIN_PANE_WIDTH) {
      newRight = MIN_PANE_WIDTH;
      newLeft = totalWidth - MIN_PANE_WIDTH;
    }

    setPaneWidths((prev) => ({
      ...prev,
      [leftPane]: newLeft,
      [rightPane]: newRight
    }));
  };

  const onResizerMouseUp = () => {
    document.removeEventListener("mousemove", onResizerMouseMove);
    document.removeEventListener("mouseup", onResizerMouseUp);
    resizingRef.current = null;
  };

  const renderPane = (pane: string, width?: number) => {
    if (!paneState.open[pane]) return null;
    switch (pane) {
      case "explorer":
        return (
          <Paper
            shadow="xs"
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
                    background:
                      selectedFile === file.fileName ? "#f3f3f3" : undefined,
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
                      onChange={(e) =>
                        dispatch(setRenameValue(e.currentTarget.value))
                      }
                      size="xs"
                      autoFocus
                      onBlur={confirmRename}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          confirmRename();
                        } else if (e.key === "Escape") {
                          cancelRename();
                        }
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
          </Paper>
        );
      case "editor":
        const file = projectFiles.find((f) => f.fileName === activeTab) || {
          fileContent: "",
          fileName: ""
        };
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
                ⎌
              </ActionIcon>
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
                ↻
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                onClick={saveCurrentFile}
                size="sm"
                color="blueButCooler"
                title="Save this file"
              >
                <PiFloppyDiskBold />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                onClick={() => closePane("editor")}
                size="sm"
              >
                <PiXBold />
              </ActionIcon>
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
      case "preview":
        return (
          <Paper
            shadow="xs"
            p={0}
            style={{
              minWidth: MIN_PANE_WIDTH,
              maxWidth: 3000,
              width: width || DEFAULT_PANE_WIDTHS.preview,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "width 0.1s"
            }}
            draggable
            onDragStart={() => onDragStart("preview")}
            onDragOver={(e) => onDragOver(e, "preview")}
          >
            <Group
              align="apart"
              px="sm"
              py="xs"
              style={{ borderBottom: "1px solid #eee" }}
            >
              <Group gap={4}>
                <PiMonitorBold />
                <Text size="sm">Preview</Text>
              </Group>
              <ActionIcon
                variant="subtle"
                onClick={() => closePane("preview")}
                size="sm"
              >
                <PiXBold />
              </ActionIcon>
            </Group>
            <Box style={{ flex: 1, minHeight: 0 }}>
              <iframe
                key={projectVersion}
                src={`${import.meta.env.VITE_BACKEND_URL}/pf/${projectName}/`}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Project Preview"
              />
            </Box>
          </Paper>
        );
      case "settings":
        return (
          <Paper
            shadow="xs"
            p={0}
            style={{
              minWidth: MIN_PANE_WIDTH,
              maxWidth: 600,
              width: width || DEFAULT_PANE_WIDTHS.settings,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "width 0.1s"
            }}
            draggable
            onDragStart={() => onDragStart("settings")}
            onDragOver={(e) => onDragOver(e, "settings")}
          >
            <Group
              align="apart"
              px="sm"
              py="xs"
              style={{ borderBottom: "1px solid #eee" }}
            >
              <Group gap={4}>
                <PiGearBold />
                <Text size="sm">Settings</Text>
              </Group>
            </Group>
            <Box style={{ flex: 1, minHeight: 0, padding: 16 }}>
              <Text fw={700} mb="sm">
                Project Settings
              </Text>
              <Text c="dimmed" size="sm">
                (settings)
              </Text>
            </Box>
          </Paper>
        );
      default:
        return null;
    }
  };

  function getMonacoLang(filename: string) {
    if (!filename) return "plaintext";
    if (filename.endsWith(".js")) return "javascript";
    if (filename.endsWith(".css")) return "css";
    if (filename.endsWith(".html")) return "html";
    return "plaintext";
  }

  if (projectData.isLoading) return <Loader />;
  if (projectData.error) return <Text color="red">Error loading project</Text>;

  const openSettingsPane = () => {
    if (!paneState.open.settings) {
      dispatch(
        setPaneState({
          ...paneState,
          open: { ...paneState.open, settings: true }
        })
      );
    }
  };

  const renderSidebar = () => (
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
          onClick={() => setSidebarTab("explorer")}
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
          onClick={() => setSidebarTab("settings")}
        >
          <PiGearBold />
        </ActionIcon>
      </Tooltip>
    </Box>
  );

  const renderSidebarPane = (width?: number) => {
    if (sidebarTab === "explorer") {
      return (
        <Paper
          shadow="xs"
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
                  background:
                    selectedFile === file.fileName ? "#f3f3f3" : undefined,
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
                    onChange={(e) =>
                      dispatch(setRenameValue(e.currentTarget.value))
                    }
                    size="xs"
                    autoFocus
                    onBlur={confirmRename}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        confirmRename();
                      } else if (e.key === "Escape") {
                        cancelRename();
                      }
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
        </Paper>
      );
    } else if (sidebarTab === "settings") {
      return (
        <Paper
          shadow="xs"
          p={0}
          style={{
            minWidth: MIN_PANE_WIDTH,
            maxWidth: 600,
            width: DEFAULT_PANE_WIDTHS.settings,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.1s"
          }}
        >
          <Group
            align="apart"
            px="sm"
            py="xs"
            style={{ borderBottom: "1px solid #eee" }}
          >
            <Group gap={4}>
              <PiGearBold />
              <Text size="sm">Settings</Text>
            </Group>
          </Group>
          <Box style={{ flex: 1, minHeight: 0, padding: 16 }}>
            <Text fw={700} mb="sm">
              Project Settings
            </Text>
            <Text c="dimmed" size="sm">
              put settings here
            </Text>
          </Box>
        </Paper>
      );
    }
    return null;
  };

  const renderTabBar = () => (
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

  return (
    <Box
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Group
        gap="xs"
        px="md"
        py="xs"
        style={{
          borderBottom: "1px solid #eee",
          background: "#fafafa"
        }}
      >
        <Text fw={700}>{projectName}</Text>
        <Group gap={0}>
          {userIsOwner ? (
            <Tooltip label="Save">
              <ActionIcon
                onClick={save}
                color="blueButCooler"
                variant="light"
                size="md"
              >
                <PiFloppyDiskBold />
              </ActionIcon>
            </Tooltip>
          ) : (
            <Tooltip label="Copy">
              <ActionIcon
                // onClick={copy}
                color="green"
                variant="light"
                size="md"
              >
                <PiCopyBold />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
        <Group gap={0} ml="auto">
          {closedPanes
            .filter((p) => p.key !== "explorer" && p.key !== "settings")
            .map((p) => (
              <Tooltip key={p.key} label={`Show ${p.label}`}>
                <ActionIcon
                  onClick={() => openPane(p.key)}
                  variant="subtle"
                  size="md"
                >
                  {p.icon}
                </ActionIcon>
              </Tooltip>
            ))}
        </Group>
        {isLoading && <Loader size="sm" />}
      </Group>
      <Box
        style={{
          flex: 1,
          display: "flex",
          width: "100%",
          minHeight: 0,
          background: "#f6f8fa",
          position: "relative"
        }}
      >
        <Box style={{ display: "flex", height: "100%" }}>
          {renderSidebar()}
          <Box style={{ display: "flex", height: "100%" }}>
            {renderSidebarPane(paneWidths["explorer"])}
            {paneOrder.filter((p) => p !== "explorer" && p !== "settings")
              .length > 0 && (
              <div
                style={{
                  width: 6,
                  cursor: "col-resize",
                  background: "transparent",
                  zIndex: 10,
                  userSelect: "none",
                  position: "relative"
                }}
                onMouseDown={(e) => onResizerMouseDown(0, e)}
                onDoubleClick={() => {
                  setPaneWidths((prev) => ({
                    ...prev,
                    explorer: DEFAULT_PANE_WIDTHS.explorer,
                    [paneOrder.find(
                      (p) => p !== "explorer" && p !== "settings"
                    )!]:
                      DEFAULT_PANE_WIDTHS[
                        paneOrder.find(
                          (p) => p !== "explorer" && p !== "settings"
                        )!
                      ]
                  }));
                }}
              >
                <div
                  style={{
                    width: 2,
                    height: "100%",
                    background: "#ddd",
                    margin: "0 auto"
                  }}
                />
              </div>
            )}
          </Box>
        </Box>
        {paneOrder
          .filter((pane) => pane !== "explorer" && pane !== "settings")
          .map((pane, idx, arr) => (
            <React.Fragment key={pane}>
              {renderPane(pane, paneWidths[pane])}
              {idx < arr.length - 1 && (
                <div
                  style={{
                    width: 6,
                    cursor: "col-resize",
                    background: "transparent",
                    zIndex: 10,
                    userSelect: "none",
                    position: "relative"
                  }}
                  onMouseDown={(e) =>
                    onResizerMouseDown(paneOrder.indexOf(pane), e)
                  }
                  onDoubleClick={() => {
                    setPaneWidths((prev) => ({
                      ...prev,
                      [pane]: DEFAULT_PANE_WIDTHS[pane],
                      [paneOrder[paneOrder.indexOf(pane) + 1]]:
                        DEFAULT_PANE_WIDTHS[
                          paneOrder[paneOrder.indexOf(pane) + 1]
                        ]
                    }));
                  }}
                >
                  <div
                    style={{
                      width: 2,
                      height: "100%",
                      background: "#ddd",
                      margin: "0 auto"
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
      </Box>
    </Box>
  );
};

export default ProjectEditor;
