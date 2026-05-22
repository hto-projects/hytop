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
} from "../../slices/projectsApiSlice";

import { useDispatch, useSelector } from "react-redux";
import { Box, useComputedColorScheme } from "@mantine/core";
import {
  PiFilesBold,
  PiCodeBold,
  PiMonitorBold,
  PiGearBold,
  PiPencilBold
} from "react-icons/pi";
import { useMonaco } from "@monaco-editor/react";
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
} from "../../slices/editorSlice";
import { useState } from "react";

import { RootState } from "../../store";
import ExplorerPane from "./SideBar/FileSelectorPane";
import EditorPane from "./FileEditor/EditorPane";
import PreviewPane from "./Preview/PreviewPane";
import SettingsPane from "./SideBar/ProjectSettingsPane";
import Sidebar from "./SideBar/Sidebar";
import TabBar from "./FileEditor/TabBar";
import { toast } from "react-toastify";
import PreferencesPane from "../User/Preferences/PreferencesPane";
import { setProjectName, setProjectDescription } from "../../slices/editorSlice";
import { useNavigate } from "react-router-dom";
import prettier from "prettier/standalone";
import parserHtml from "prettier/plugins/html";
import parserBabel from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree";
import parserCss from "prettier/plugins/postcss";

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
  >("explorer"); // should be in Sidebar
  const { projectName } = useParams();
  const dispatch = useDispatch();
  const ownership: any = useCheckOwnershipQuery(projectName);
  const projectData: any = useGetProjectQuery(projectName);
  const [updateProject, { isLoading }] = useUpdateProjectMutation(); // should be in settings pane
  const [changeProjectName] = useChangeProjectNameMutation(); // should be in settings pane
  const [changeProjectDescription] = useChangeProjectDescriptionMutation(); // should be in settings pane
  const navigate = useNavigate();
  const match = location.pathname.match(/^\/([ec])\/([^/]+)$/); // what's this? idk
  const isEditor = !!match; // ?

  const projectID = useGetProjectIdQuery(projectName, {
    skip: !isEditor || !projectName
  });
  const projectId = projectID.data?.projectId;
  const projectDescriptionData = useGetProjectDescriptionQuery(projectId, {
    skip: !projectId
  }); // should be in settings pane

  const projectDescription = projectDescriptionData?.data?.projectDescription;
  const [currentProjectName, _setCurrentProjectName] = useState(
    projectName || ""
  ); // should be in settings pane
  const [currentProjectDescription, setCurrentProjectDescription] = useState(
    projectDescription || ""
  ); // should be in settings pane

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
    } // all this should be in sidebar
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
      setSidebarTab(pane as "explorer" | "preferences" | "settings"); // what the heck
    }
  };

  const handleTabClick = (fileName: string) => {
    dispatch(setActiveTab(fileName));
  }; // should be in EditorPane

  const handleTabClose = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(closeTab(fileName));
  }; // should be in EditorPane

  const handleFileSelect = (filename: string) => {
    dispatch(openTab(filename));
    dispatch(setSelectedFile(filename));
  }; // should be in ExplorerPane

  const startRename = (filename: string) => {
    dispatch(setRenamingFile(filename));
    dispatch(setRenameValue(filename));
  }; // should be in ExplorerPane

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
  }; // dang this is crazy, should be in ExplorerPane

  const cancelRename = () => {
    dispatch(setRenamingFile(null));
    dispatch(setRenameValue(""));
  }; // should be in ExplorerPane

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
    const newFileName = `new-file-${Date.now()}.${ext}`; // this is wild
    // maybe just force new file to be named with everything, not selecting type
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

  const formatAndSaveAllFiles = async () => { // maybe encapsulate this somewhere else
    const parserByFileExtension = new Map<
      string,
      { parser: string; plugins: any[] }
    >([
      ["html", { parser: "html", plugins: [parserHtml] }],
      ["css", { parser: "css", plugins: [parserCss] }],
      ["js", { parser: "babel", plugins: [parserBabel, parserEstree] }]
    ]); 

    try {
      const formattedFiles = [];
      for (const file of projectFiles) {
        const fileExtension = file.fileName.split(".").pop() || "";
        const config = parserByFileExtension.get(fileExtension);
        if (config) {
          const formatted = await prettier.format(file.fileContent, {
            parser: config.parser,
            plugins: config.plugins
          });
          formattedFiles.push({
            fileContent: formatted,
            fileName: file.fileName
          });
        } else {
          console.error(
            `No Prettier parser found for file extension: ${fileExtension}. Skipping formatting this file.`
          );
          formattedFiles.push({
            fileContent: file.fileContent,
            fileName: file.fileName
          });
        }
      }

      dispatch(setProjectFiles(formattedFiles));

      // Update Monaco Editor models with formatted content
      if (monaco) {
        formattedFiles.forEach((file) => {
          const model = modelsRef.current[file.fileName];
          if (model && model.getValue() !== file.fileContent) {
            // Save current view state before updating
            if (activeTab === file.fileName && editorRef.current) {
              viewStatesRef.current[file.fileName] =
                editorRef.current.saveViewState();
            }

            // Update model content
            model.setValue(file.fileContent);

            // Restore view state if this is the active tab
            if (
              activeTab === file.fileName &&
              editorRef.current &&
              viewStatesRef.current[file.fileName]
            ) {
              editorRef.current.restoreViewState(
                viewStatesRef.current[file.fileName]
              );
            }
          }
        });
      }

      // Save to backend
      await updateProject({
        projectFiles: formattedFiles,
        projectName
      }).unwrap();
      dispatch(setProjectVersion(projectVersion + 1));
      setUnsavedFiles({});
    } catch (err) {
      console.error(err);
    }
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
  }, [monaco]); // idk what this is doing

  useEffect(() => {
    if (!monaco) return;
    Object.keys(modelsRef.current).forEach((fname) => {
      if (!projectFiles.find((f) => f.fileName === fname)) {
        modelsRef.current[fname]?.dispose();
        delete modelsRef.current[fname];
        delete viewStatesRef.current[fname];
      }
    }); // idk what this is doing
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
  ]); // idk

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
  }, [activeTab, monaco]); // idk

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
    }); // idk

    return () => {
      Object.values(modelsRef.current).forEach((model: any) => {
        if (model.__listener) {
          model.__listener.dispose();
          model.__listener = null;
        }
      });
    };
  }, [monaco, activeTab, projectFiles.map((f) => f.fileName).join(",")]); // idk

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

  const paneWidths = DEFAULT_PANE_WIDTHS;
  const paneOrder = paneState.order.filter((p) => paneState.open[p]);
  const canResize = false;

  React.useEffect(() => {
    const handler = () => {
      if (userIsOwner) saveAllFiles();
    };
    window.addEventListener("saveAllFiles", handler);
    return () => window.removeEventListener("saveAllFiles", handler);
  }, [userIsOwner, projectFiles, projectName, projectVersion]);

  React.useEffect(() => {
    const handler = () => {
      formatAndSaveAllFiles();
    };
    window.addEventListener("formatAndSaveAllFiles", handler);
    return () => window.removeEventListener("formatAndSaveAllFiles", handler);
  });

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
  }, [readyToSetTab]); // is this worth it?

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem(localStorageSelectedFile, activeTab);
    }
  }, [activeTab, localStorageSelectedFile]); // is this worth it?
  useEffect(() => {
    if (tabs && tabs.length) {
      localStorage.setItem(localStorageTabs, JSON.stringify(tabs));
    }
  }, [tabs, localStorageTabs]); // is it?

  useEffect(() => {
    if (!monaco) return;
    const editor = editorRef.current;
    if (!editor) return;
    if ((editor as any).hipleasework) return;
    (editor as any).hipleasework = true; // truly what

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
        ].includes(tag); // should not do this by default but what are we gonna do

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

  const handleChangeProjectName = async (newName: string) => { // should be in SettingsPane
    if (!projectId || !newName || newName === currentProjectName) return;

    try {
      const res = await changeProjectName({
        projectId,
        newProjectName: newName
      }).unwrap();
      _setCurrentProjectName(res.projectName);
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

  const handleChangeProjectDescription = async (newDesc: string) => { // SettingsPane
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
      _setCurrentProjectName(projectName);
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
            {sidebarTab === "explorer" && paneState.open.explorer && ( // not this. please not this. should just be: SideBar, EditorPane, PreviewPane. SideBar = explorer + settings + preferences. EditorPane = TabBar + EditorPane. PreviewPane = PreviewPane.
              <ExplorerPane
                MIN_PANE_WIDTH={MIN_PANE_WIDTH}
                DEFAULT_PANE_WIDTHS={DEFAULT_PANE_WIDTHS}
                width={paneWidths["explorer"]}
                onDragStart={() => {}}
                onDragOver={() => {}}
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
                onDragStart={() => {}}
                onDragOver={() => {}}
                closePane={closePane}
              />
            )}
            {sidebarTab === "settings" && paneState.open.settings && (
              <SettingsPane
                MIN_PANE_WIDTH={MIN_PANE_WIDTH}
                DEFAULT_PANE_WIDTHS={DEFAULT_PANE_WIDTHS}
                width={paneWidths["settings"]}
                onDragStart={() => {}}
                onDragOver={() => {}}
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
                  onMouseDown={(e) => {}}
                  onDoubleClick={() => {

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
                    onDragStart={() => {}}
                    onDragOver={() => {}}
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
                    onDragStart={() => {}}
                    onDragOver={() => {}}
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
                    onDragStart={() => {}}
                    onDragOver={() => {}}
                    closePane={closePane}
                  />
                )}
                {pane === "settings" && (
                  <SettingsPane
                    MIN_PANE_WIDTH={MIN_PANE_WIDTH}
                    DEFAULT_PANE_WIDTHS={DEFAULT_PANE_WIDTHS}
                    width={paneWidths[pane]}
                    onDragStart={() => {}}
                    onDragOver={() => {}}
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
                    onMouseDown={(e) => {}}
                    onDoubleClick={() => {
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
