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
  Menu,
  CopyButton,
  useComputedColorScheme
} from "@mantine/core";
import {
  PiFilesBold,
  PiCodeBold,
  PiMonitorBold,
  PiFloppyDiskBold,
  PiGitForkBold,
  PiXBold,
  PiFilePlusBold,
  PiFileCss,
  PiFileHtml,
  PiFileJs,
  PiGearBold,
  PiDotOutlineFill,
  PiLinkBold,
  PiArrowSquareOutBold,
  PiArrowCounterClockwiseBold,
  PiArrowClockwiseBold
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
import ExplorerPane from "../components/editor/ExplorerPane";
import EditorPane from "../components/editor/EditorPane";
import PreviewPane from "../components/editor/PreviewPane";
import SettingsPane from "../components/editor/SettingsPane";
import Sidebar from "../components/editor/Sidebar";
import TabBar from "../components/editor/TabBar";

function getMonacoLang(filename: string) {
  if (!filename) return "plaintext";
  if (filename.endsWith(".js")) return "javascript";
  if (filename.endsWith(".css")) return "css";
  if (filename.endsWith(".html")) return "html";
  return "plaintext";
}

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
  const theColorScheme = useComputedColorScheme("light");
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

  const userIsOwner = ownership.data?.isOwner || false;

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
    dispatch(setSelectedFile(filename));
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

  const saveAllFiles = async () => {
    try {
      await updateProject({ projectFiles, projectName }).unwrap();
      dispatch(setProjectVersion(projectVersion + 1));
      setUnsavedFiles({});
    } catch (err) {}
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

  const forkProject = () => {
    window.location.href = `/c/${projectName}`;
  };

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

  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  const darkMode = useSelector((state: any) => state.theme.darkMode);

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
          borderBottom:
            theColorScheme === "dark" ? "1px solid #333" : "1px solid #eee",
          background: theColorScheme === "dark" ? "#181A1B" : "#fafafa",
          color: theColorScheme === "dark" ? "#fff" : undefined
        }}
      >
        <Text fw={700} c={theColorScheme === "dark" ? "#fff" : undefined}>
          {projectName}
        </Text>
        <Group gap={0}>
          {userIsOwner ? (
            <Tooltip label="Save All">
              <ActionIcon
                onClick={saveAllFiles}
                color={primaryColor}
                size="md"
                style={{
                  color: theColorScheme === "dark" ? "#fff" : undefined
                }}
              >
                <PiFloppyDiskBold />
              </ActionIcon>
            </Tooltip>
          ) : (
            <Tooltip label="Fork Project">
              <ActionIcon
                onClick={forkProject}
                color="green"
                variant="light"
                size="md"
                style={{
                  color: theColorScheme === "dark" ? "#fff" : undefined
                }}
              >
                <PiGitForkBold />
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
                  style={{
                    color: theColorScheme === "dark" ? "#fff" : undefined
                  }}
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
          <Sidebar sidebarTab={sidebarTab} setSidebarTab={setSidebarTab} />
          <Box style={{ display: "flex", height: "100%" }}>
            {sidebarTab === "explorer" && (
              <ExplorerPane
                MIN_PANE_WIDTH={MIN_PANE_WIDTH}
                DEFAULT_PANE_WIDTHS={DEFAULT_PANE_WIDTHS}
                width={paneWidths["explorer"]}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                closePane={closePane}
                addFile={addFile}
                projectFiles={projectFiles}
                selectedFile={selectedFile}
                handleFileSelect={handleFileSelect}
                startRename={startRename}
                unsavedFiles={unsavedFiles}
                renamingFile={renamingFile}
                renameValue={renameValue}
                dispatch={dispatch}
                setRenameValue={setRenameValue}
                confirmRename={confirmRename}
                cancelRename={cancelRename}
                style={undefined}
              />
            )}
            {sidebarTab === "settings" && (
              <SettingsPane
                MIN_PANE_WIDTH={MIN_PANE_WIDTH}
                DEFAULT_PANE_WIDTHS={DEFAULT_PANE_WIDTHS}
                width={paneWidths["settings"]}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
              />
            )}
            {paneOrder.filter((p) => p !== "explorer" && p !== "settings")
              .length > 0 && (
              <div
                style={{
                  width: 6,
                  cursor: "col-resize",
                  background:
                    theColorScheme === "dark" ? "#23272A" : "transparent",
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
                    background: theColorScheme === "dark" ? "#333" : "#ddd",
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
              {pane === "editor" && (
                <EditorPane
                  MIN_PANE_WIDTH={MIN_PANE_WIDTH}
                  DEFAULT_PANE_WIDTHS={DEFAULT_PANE_WIDTHS}
                  width={paneWidths[pane]}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  closePane={closePane}
                  renderTabBar={() => (
                    <TabBar
                      tabs={tabs}
                      activeTab={activeTab}
                      unsavedFiles={unsavedFiles}
                      handleTabClick={handleTabClick}
                      handleTabClose={handleTabClose}
                      // I don't know why this is needed but it was screaming at me and this works for some reason lol
                      primaryColor={undefined}
                    />
                  )}
                  unsavedFiles={unsavedFiles}
                  activeTab={activeTab}
                  saveCurrentFile={saveCurrentFile}
                  editorRef={editorRef}
                  monaco={monaco}
                  modelsRef={modelsRef}
                  getMonacoLang={getMonacoLang}
                  userIsOwner={userIsOwner}
                />
              )}
              {pane === "preview" && (
                <PreviewPane
                  MIN_PANE_WIDTH={MIN_PANE_WIDTH}
                  DEFAULT_PANE_WIDTHS={DEFAULT_PANE_WIDTHS}
                  width={paneWidths[pane]}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  closePane={closePane}
                  previewUrl={`${
                    import.meta.env.VITE_BACKEND_URL
                  }/pf/${projectName}/`}
                  projectVersion={projectVersion}
                />
              )}
              {pane === "settings" && (
                <SettingsPane
                  MIN_PANE_WIDTH={MIN_PANE_WIDTH}
                  DEFAULT_PANE_WIDTHS={DEFAULT_PANE_WIDTHS}
                  width={paneWidths[pane]}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                />
              )}
              {idx < arr.length - 1 && (
                <div
                  style={{
                    width: 6,
                    cursor: "col-resize",
                    background:
                      theColorScheme === "dark" ? "#23272A" : "transparent",
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
                      background: theColorScheme === "dark" ? "#333" : "#ddd",
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
