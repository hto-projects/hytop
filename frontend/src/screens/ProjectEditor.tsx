import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  useCheckOwnershipQuery,
  useGetProjectQuery,
  useUpdateProjectMutation,
  useChangeProjectDescriptionMutation,
  useChangeProjectNameMutation,
  useGetProjectIdQuery,
  useGetProjectDescriptionQuery
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
  PiPencilBold,
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
  syncTabsWithFiles,
  setEditorIsLoading,
  setUserIsOwner,
  setCurrentProjectName
} from "../slices/editorSlice";
import { IProject } from "../../../shared/types";
import { useState } from "react";

import { RootState } from "../store";
import ExplorerPane from "../components/editor/ExplorerPane";
import EditorPane from "../components/editor/EditorPane";
import PreviewPane from "../components/editor/PreviewPane";
import SettingsPane from "../components/editor/SettingsPane";
import Sidebar from "../components/editor/Sidebar";
import TabBar from "../components/editor/TabBar";
import Header from "../components/Header";
import { toast } from "react-toastify";
import PreferencesPane from "../components/editor/PreferencesPane";
import { setProjectName, setProjectDescription } from "../slices/editorSlice";
import { useNavigate } from "react-router-dom";
import { ref } from "process";

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
  { key: "preferences", icon: <PiPencilBold />, label: "Preferences" },
  { key: "settings", icon: <PiGearBold />, label: "Settings" }
];

const DEFAULT_PANE_WIDTHS = {
  explorer: 260,
  editor: 600,
  preview: 400,
  settings: 260,
  preferences: 260
};

const MIN_PANE_WIDTH = 60;
const ProjectEditor = () => {
  const monaco = useMonaco();
  const theColorScheme = useComputedColorScheme("light");
  const [sidebarTab, setSidebarTab] = React.useState<
    "explorer" | "preferences" | "settings" | null
  >("explorer");
  const { projectName } = useParams();
  const { projectName: routeProjectName } = useParams();
  const dispatch = useDispatch();
  const ownership: any = useCheckOwnershipQuery(projectName);
  const projectData: any = useGetProjectQuery(projectName);
  const [updateProject, { isLoading }] = useUpdateProjectMutation();
  const [changeProjectName] = useChangeProjectNameMutation();
  const [changeProjectDescription] = useChangeProjectDescriptionMutation();
  const navigate = useNavigate();
  const match = location.pathname.match(/^\/([ec])\/([^/]+)$/);
  const isEditor = !!match;

  const projectID = useGetProjectIdQuery(projectName, {
    skip: !isEditor || !projectName
  });
  const projectId = projectID.data?.projectId;
  const projectDescriptionData = useGetProjectDescriptionQuery(projectId, {
    skip: !projectId
  });

  const projectDescription = projectDescriptionData?.data?.projectDescription;
  const [currentProjectName, setCurrentProjectNamem] = useState(
    projectName || ""
  );
  const [currentProjectDescription, setCurrentProjectDescription] = useState(
    projectDescription || ""
  );

  const {
    paneState,
    selectedFile,
    projectFiles,
    projectVersion,
    renamingFile,
    renameValue,
    tabs,
    activeTab,
    lastClosedTab
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
    if (!monaco || !editorRef.current) return;
    if (activeTab && modelsRef.current[activeTab]) {
      const model = modelsRef.current[activeTab];
      if (editorRef.current.getModel() !== model) {
        editorRef.current.setModel(model);
        if (viewStatesRef.current[activeTab]) {
          editorRef.current.restoreViewState(viewStatesRef.current[activeTab]);
        }
        editorRef.current.focus();
        editorRef.current.__lastFile = activeTab;
        const language = getMonacoLang(activeTab);
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [activeTab, selectedFile, monaco]);

  // TODO: fix drag and resize functionality
  // const [dragged, setDragged] = React.useState<string | null>(null);

  // placeholder
  const onDragStart = (pane: string) => {};
  const onDragOver = (e: React.DragEvent, pane: string) => {};

  // const onDragStart = (pane: string) => setDragged(pane);
  // const onDragOver = (e: React.DragEvent, pane: string) => {
  //   e.preventDefault();
  //   if (dragged && dragged !== pane) {
  //     const newOrder = [...paneState.order];
  //     const fromIdx = newOrder.indexOf(dragged);
  //     const toIdx = newOrder.indexOf(pane);
  //     newOrder.splice(fromIdx, 1);
  //     newOrder.splice(toIdx, 0, dragged);
  //     dispatch(setPaneState({ ...paneState, order: newOrder }));
  //   }
  // };

  const closePane = (pane: string) => {
    dispatch(
      setPaneState({
        ...paneState,
        open: { ...paneState.open, [pane]: false }
      })
    );
    if (
      sidebarTab === pane &&
      (pane === "explorer" || pane === "preferences" || pane === "settings")
    ) {
      setSidebarTab(null);
    }
  };

  const openPane = (pane: string, closeNOW?: boolean) => {
    if (closeNOW) {
      dispatch(
        setPaneState({
          ...paneState,
          open: { ...paneState.open, [pane]: false }
        })
      );
      if (sidebarTab === pane) setSidebarTab(null);
    } else {
      dispatch(
        setPaneState({
          ...paneState,
          open: { ...paneState.open, [pane]: true }
        })
      );
      setSidebarTab(pane as "explorer" | "preferences" | "settings");
    }
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

  const confirmRename = async (e?: any) => {
    if (
      renameValue &&
      renameValue !== renamingFile &&
      !projectFiles.some((y) => y.fileName === renameValue)
    ) {
      const updatedFiles = projectFiles.map((ts) =>
        ts.fileName === renamingFile ? { ...ts, fileName: renameValue } : ts
      );
      if (tabs.includes(renamingFile)) {
        dispatch(
          setTabs(tabs.map((tab) => (tab === renamingFile ? renameValue : tab)))
        );
      }
      if (activeTab === renamingFile) {
        dispatch(setActiveTab(renameValue));
      }
      if (monaco && modelsRef.current[renamingFile]) {
        modelsRef.current[renamingFile].dispose();
        delete modelsRef.current[renamingFile];
      }
      dispatch(setProjectFiles(updatedFiles));
      dispatch(setRenameFile({ oldName: renamingFile, newName: renameValue }));
      try {
        await updateProject({
          projectFiles: updatedFiles,
          projectName
        }).unwrap();
        dispatch(setProjectVersion(projectVersion + 1));
        setUnsavedFiles({});
      } catch (err) {}
    }
    dispatch(setRenamingFile(null));
    dispatch(setRenameValue(""));
  };

  const cancelRename = () => {
    dispatch(setRenamingFile(null));
    dispatch(setRenameValue(""));
  };

  const addFile = (type: "html" | "css" | "js") => {
    console.log("layla");
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
    const newFileName = `new-file-${Date.now()}.${ext}`;
    dispatch(
      setProjectFiles([
        ...projectFiles,
        {
          fileName: newFileName,
          fileContent: content
        }
      ])
    );
    dispatch(setRenamingFile(newFileName));
    dispatch(setRenameValue(newFileName));
  };

  const saveAllFiles = async () => {
    try {
      await updateProject({ projectFiles, projectName }).unwrap();
      dispatch(setProjectVersion(projectVersion + 1));
      setUnsavedFiles({});
    } catch (err) {}
  };

  const editorRef = useRef<any>(null);
  const modelsRef = useRef<{ [filename: string]: any }>({});
  const viewStatesRef = useRef<{ [filename: string]: any }>({});

  useEffect(() => {
    return () => {
      if (monaco) {
        Object.values(modelsRef.current).forEach((model: any) => {
          if (model && typeof model.dispose === "function") {
            try {
              model.dispose();
            } catch (e) {}
          }
        });
        modelsRef.current = {};
        viewStatesRef.current = {};
      }
    };
  }, [monaco]);

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
        let model = monaco.editor.getModel(uri);
        if (model) {
          modelsRef.current[file.fileName] = model;
        } else {
          model = monaco.editor.createModel(
            file.fileContent,
            getMonacoLang(file.fileName),
            uri
          );
          modelsRef.current[file.fileName] = model;
        }
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

  const previewUrl = `${import.meta.env.VITE_BACKEND_URL}/pf/${projectName}/`;
  const Openinnewtabe = async () => {
    window.open(previewUrl, "_blank");
  };
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

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveCurrentFile();
      }
      if (e.ctrlKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        Openinnewtabe();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [userIsOwner, projectFiles, projectName, projectVersion]);

  // honestly idk this barely works
  // const [paneWidths, setPaneWidths] = React.useState(() => ({
  //   ...DEFAULT_PANE_WIDTHS
  // }));
  // const paneOrder = paneState.order.filter((p) => paneState.open[p]);

  // const closedPanes = paneTypes.filter((p) => !paneState.open[p.key]);

  // const resizingRef = React.useRef<{
  //   idx: number;
  //   startX: number;
  //   startWidths: number[];
  // } | null>(null);

  // const canResize = paneOrder.length > 1;

  const paneWidths = DEFAULT_PANE_WIDTHS;
  const paneOrder = paneState.order.filter((p) => paneState.open[p]);
  const closedPanes = paneTypes.filter((p) => !paneState.open[p.key]);
  const canResize = false;

  // const onResizerMouseDown = (idx: number, e: React.MouseEvent) => {
  //   if (!canResize) return;
  //   resizingRef.current = {
  //     idx,
  //     startX: e.clientX,
  //     startWidths: paneOrder.map((p) => paneWidths[p] || DEFAULT_PANE_WIDTHS[p])
  //   };
  //   document.addEventListener("mousemove", onResizerMouseMove);
  //   document.addEventListener("mouseup", onResizerMouseUp);
  // };

  // const onResizerMouseMove = (e: MouseEvent) => {
  //   if (!resizingRef.current) return;
  //   const { idx, startX, startWidths } = resizingRef.current;
  //   const delta = e.clientX - startX;
  //   const leftPane = paneOrder[idx];
  //   const rightPane = paneOrder[idx + 1];

  //   const totalWidth = startWidths[idx] + startWidths[idx + 1];

  //   let newLeft = startWidths[idx] + delta;
  //   let newRight = startWidths[idx + 1] - delta;

  //   if (newLeft < MIN_PANE_WIDTH) {
  //     newLeft = MIN_PANE_WIDTH;
  //     newRight = totalWidth - MIN_PANE_WIDTH;
  //   } else if (newRight < MIN_PANE_WIDTH) {
  //     newRight = MIN_PANE_WIDTH;
  //     newLeft = totalWidth - MIN_PANE_WIDTH;
  //   }

  //   setPaneWidths((prev) => ({
  //     ...prev,
  //     [leftPane]: newLeft,
  //     [rightPane]: newRight
  //   }));
  // };

  // const onResizerMouseUp = () => {
  //   document.removeEventListener("mousemove", onResizerMouseMove);
  //   document.removeEventListener("mouseup", onResizerMouseUp);
  //   resizingRef.current = null;
  // };

  // placeholder
  const onResizerMouseDown = (idx: number, e: React.MouseEvent) => {};
  const onResizerMouseMove = (e: MouseEvent) => {};
  const onResizerMouseUp = () => {};

  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  const darkMode = useSelector((state: any) => state.theme.darkMode);

  React.useEffect(() => {
    const handler = () => {
      if (userIsOwner) saveAllFiles();
    };
    window.addEventListener("saveAllFiles", handler);
    return () => window.removeEventListener("saveAllFiles", handler);
  }, [userIsOwner, projectFiles, projectName, projectVersion]);

  React.useEffect(() => {
    dispatch(setUserIsOwner(userIsOwner));
  }, [userIsOwner, dispatch]);
  React.useEffect(() => {
    dispatch(setEditorIsLoading(isLoading));
  }, [isLoading, dispatch]);

  const localStorageSelectedFile = `hytop_selectedFile_${projectName}`;
  const localStorageTabs = `hytop_tabs_${projectName}`;

  const [readyToSetTab, setReadyToSetTab] = React.useState(false);

  useEffect(() => {
    if (projectData?.data) {
      const currentReduxFiles = projectFiles;
      const serverFiles = projectData.data.projectFiles;

      if (currentReduxFiles.length === 0) {
        dispatch(setProjectFiles(serverFiles));
      } else {
        const mergedFiles = serverFiles.map((serverFile) => {
          const existingFile = currentReduxFiles.find(
            (f) => f.fileName === serverFile.fileName
          );
          if (existingFile) {
            const model = modelsRef.current[serverFile.fileName];
            if (model && typeof model.getValue === "function") {
              const modelContent = model.getValue();
              if (modelContent && modelContent !== serverFile.fileContent) {
                setUnsavedFiles((prev) => ({
                  ...prev,
                  [serverFile.fileName]: true
                }));
                return { ...serverFile, fileContent: modelContent };
              }
            }
            if (existingFile.fileContent !== serverFile.fileContent) {
              setUnsavedFiles((prev) => ({
                ...prev,
                [serverFile.fileName]: true
              }));
              return existingFile;
            }
          }
          return serverFile;
        });

        const reduxOnlyFlies = currentReduxFiles.filter(
          (reduxFile) =>
            !serverFiles.find((sf) => sf.fileName === reduxFile.fileName)
        );

        dispatch(setProjectFiles([...mergedFiles, ...reduxOnlyFlies]));
      }

      dispatch(setCurrentProjectName(projectData.data.projectName));
    }
  }, [projectData?.data]);

  useEffect(() => {
    if (!monaco) return;
    if (
      projectFiles.length > 0 &&
      projectFiles.every((f) => modelsRef.current[f.fileName])
    ) {
      setReadyToSetTab(true);
    }
  }, [
    monaco,
    projectFiles.map((f) => f.fileName).join(","),
    Object.keys(modelsRef.current).join(",")
  ]);

  useEffect(() => {
    if (!readyToSetTab) return;
    const savedTabs = (() => {
      try {
        return JSON.parse(localStorage.getItem(localStorageTabs) || "[]");
      } catch {
        return [];
      }
    })();
    const savedSelectedFile = localStorage.getItem(localStorageSelectedFile);
    const fileNames = projectFiles.map((f) => f.fileName);
    const validTabs = savedTabs.filter((tab) => fileNames.includes(tab));
    const validSelectedFile =
      savedSelectedFile && fileNames.includes(savedSelectedFile)
        ? savedSelectedFile
        : validTabs.length > 0
        ? validTabs[0]
        : fileNames[0];

    if (validTabs.length > 0) {
      dispatch(setTabs(validTabs));
      dispatch(setActiveTab(validSelectedFile));
      dispatch(setSelectedFile(validSelectedFile));
    } else if (fileNames.length > 0) {
      dispatch(setTabs([fileNames[0]]));
      dispatch(setActiveTab(fileNames[0]));
      dispatch(setSelectedFile(fileNames[0]));
    }
    setReadyToSetTab(false);
  }, [readyToSetTab]);

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem(localStorageSelectedFile, activeTab);
    }
  }, [activeTab, localStorageSelectedFile]);
  useEffect(() => {
    if (tabs && tabs.length) {
      localStorage.setItem(localStorageTabs, JSON.stringify(tabs));
    }
  }, [tabs, localStorageTabs]);

  useEffect(() => {
    if (!monaco) return;
    const editor = editorRef.current;
    if (!editor) return;
    if ((editor as any).hipleasework) return;
    (editor as any).hipleasework = true;

    editor.onKeyDown((event) => {
      if (event.browserEvent.key !== ">") return;
      const model = editor.getModel();
      if (!model) return;
      const enabledLanguages = ["html"];
      if (!enabledLanguages.includes(model.getLanguageId())) return;
      const isSelfClosing = (tag: string) =>
        [
          "area",
          "base",
          "br",
          "col",
          "command",
          "embed",
          "hr",
          "img",
          "input",
          "keygen",
          "link",
          "meta",
          "param",
          "source",
          "track",
          "wbr",
          "circle",
          "ellipse",
          "line",
          "path",
          "polygon",
          "polyline",
          "rect",
          "stop",
          "use"
        ].includes(tag);

      const selections = editor.getSelections();
      if (!selections) return;
      const edits: any[] = [];
      const newSelections: any[] = [];
      for (const selection of selections) {
        newSelections.push(
          new monaco.Selection(
            selection.selectionStartLineNumber,
            selection.selectionStartColumn + 1,
            selection.endLineNumber,
            selection.endColumn + 1
          )
        );
        const contentBefore = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: selection.endLineNumber,
          endColumn: selection.endColumn
        });
        const matchytwo = contentBefore.match(/<([\w-]+)(?![^>]*\/>)[^>]*$/);
        if (!matchytwo) continue;
        const [fullMatch, tag] = matchytwo;
        if (isSelfClosing(tag) || fullMatch.trim().endsWith("/")) continue;

        const positionMeow = selection.getEndPosition();
        const totalLines = model.getLineCount();
        const afterRange = {
          startLineNumber: positionMeow.lineNumber,
          startColumn: positionMeow.column + 1,
          endLineNumber: totalLines,
          endColumn: model.getLineMaxColumn(totalLines)
        };
        const afterText = model.getValueInRange(afterRange);
        const letsClose = `</${tag}>`;
        if (afterText.includes(letsClose)) continue;

        edits.push({
          range: {
            startLineNumber: selection.endLineNumber,
            startColumn: selection.endColumn + 1,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn + 1
          },
          text: letsClose
        });
      }
      if (edits.length > 0) {
        setTimeout(() => {
          editor.executeEdits(model.getValue(), edits, newSelections);
        }, 0);
      }
    });
  }, [monaco, editorRef.current]);

  useEffect(() => {
    if (
      paneState.open.editor &&
      (!activeTab || !tabs.length) &&
      lastClosedTab &&
      projectFiles.some((f) => f.fileName === lastClosedTab)
    ) {
      dispatch(openTab(lastClosedTab));
    }
  }, [
    paneState.open.editor,
    lastClosedTab,
    projectFiles,
    activeTab,
    tabs.length,
    dispatch
  ]);

  const handleChangeProjectName = async (newName: string) => {
    if (!projectId || !newName || newName === currentProjectName) return;

    try {
      const res = await changeProjectName({
        projectId,
        newProjectName: newName
      }).unwrap();
      setCurrentProjectNamem(res.projectName);
      dispatch(setProjectName(res.projectName));

      if (res.projectName !== projectName) {
        navigate(`/e/${encodeURIComponent(res.projectName)}`, {
          replace: true
        });
      }

      toast.success("Successfully updated project name");
      return true;
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update project name");
      return false;
    }
  };

  const handleChangeProjectDescription = async (newDesc: string) => {
    if (!projectId || !newDesc) return;
    try {
      const res = await changeProjectDescription({
        projectId,
        newProjectDescription: newDesc
      }).unwrap();
      setCurrentProjectDescription(res.projectDescription);
      dispatch(setProjectDescription(res.projectDescription));
      toast.success("Successfully updated project description");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update project description");
    }
  };

  useEffect(() => {
    if (projectName !== undefined) {
      setCurrentProjectNamem(projectName);
    }
  }, [projectName]);

  useEffect(() => {
    if (projectDescription !== undefined) {
      setCurrentProjectDescription(projectDescription);
    }
  }, [projectDescription]);

  return (
    <Box
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <Box
        style={{
          flex: 1,
          display: "flex",
          width: "100%",
          minHeight: 0,
          background: "#f6f8fa",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Box style={{ display: "flex", height: "100%" }}>
          <Sidebar
            sidebarTab={sidebarTab}
            setSidebarTab={setSidebarTab}
            openPane={openPane}
          />
          <Box style={{ display: "flex", height: "100%" }}>
            {sidebarTab === "explorer" && paneState.open.explorer && (
              <ExplorerPane
                MIN_PANE_WIDTH={MIN_PANE_WIDTH}
                DEFAULT_PANE_WIDTHS={DEFAULT_PANE_WIDTHS}
                width={paneWidths["explorer"]}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                closePane={closePane}
                addFile={addFile}
                userIsOwner={userIsOwner}
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
            {sidebarTab === "preferences" && paneState.open.preferences && (
              <PreferencesPane
                MIN_PANE_WIDTH={MIN_PANE_WIDTH}
                DEFAULT_PANE_WIDTHS={DEFAULT_PANE_WIDTHS}
                width={paneWidths["preferences"]}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                closePane={closePane}
              />
            )}
            {sidebarTab === "settings" && paneState.open.settings && (
              <SettingsPane
                MIN_PANE_WIDTH={MIN_PANE_WIDTH}
                DEFAULT_PANE_WIDTHS={DEFAULT_PANE_WIDTHS}
                width={paneWidths["settings"]}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                closePane={closePane}
                projectId={projectId}
                projectName={projectName}
                projectDescription={projectDescription}
                changeProjectName={handleChangeProjectName}
                changeProjectDescription={handleChangeProjectDescription}
              />
            )}
            {canResize &&
              paneOrder.filter(
                (p) =>
                  p !== "explorer" && p !== "preferences" && p !== "settings"
              ).length > 0 && (
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
                    // setPaneWidths((prev) => ({
                    //   ...prev,
                    //   explorer: DEFAULT_PANE_WIDTHS.explorer,
                    //   [paneOrder.find(
                    //     (p) => p !== "explorer" && p !== "settings"
                    //   )!]:
                    //     DEFAULT_PANE_WIDTHS[
                    //       paneOrder.find(
                    //         (p) => p !== "explorer" && p !== "settings"
                    //       )!
                    //     ]
                    // }));
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
          .filter(
            (pane) =>
              pane !== "explorer" &&
              pane !== "preferences" &&
              pane !== "settings" &&
              (pane !== "editor" ||
                (paneState.open.editor && tabs.length > 0 && activeTab))
          )
          .map((pane, idx, arr) => {
            const isPreviewMaximized =
              pane === "preview" &&
              (!paneState.open.editor || tabs.length === 0);

            return (
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
                    width={isPreviewMaximized ? "100vw" : paneWidths[pane]}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    closePane={closePane}
                    previewUrl={`${
                      import.meta.env.VITE_BACKEND_URL
                    }/pf/${projectName}/`}
                    projectVersion={projectVersion}
                  />
                )}
                {pane === "preferences" && (
                  <PreferencesPane
                    MIN_PANE_WIDTH={MIN_PANE_WIDTH}
                    DEFAULT_PANE_WIDTHS={DEFAULT_PANE_WIDTHS}
                    width={paneWidths[pane]}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    closePane={closePane}
                  />
                )}
                {pane === "settings" && (
                  <SettingsPane
                    MIN_PANE_WIDTH={MIN_PANE_WIDTH}
                    DEFAULT_PANE_WIDTHS={DEFAULT_PANE_WIDTHS}
                    width={paneWidths[pane]}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    closePane={closePane}
                    projectId={projectId}
                    projectName={projectName}
                    projectDescription={projectDescription}
                    changeProjectName={changeProjectName}
                    changeProjectDescription={changeProjectDescription}
                  />
                )}
                {idx < arr.length - 1 && canResize && (
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
                      // setPaneWidths((prev) => ({
                      //   ...prev,
                      //   [pane]: DEFAULT_PANE_WIDTHS[pane],
                      //   [paneOrder[paneOrder.indexOf(pane) + 1]]:
                      //     DEFAULT_PANE_WIDTHS[
                      //       paneOrder[paneOrder.indexOf(pane) + 1]
                      //     ]
                      // }));
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
            );
          })}
      </Box>
    </Box>
  );
};

export default ProjectEditor;
