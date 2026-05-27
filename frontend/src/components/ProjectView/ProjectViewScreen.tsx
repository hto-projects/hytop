import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  useCheckOwnershipQuery,
  useGetProjectQuery,
  useUpdateProjectMutation
} from "../../slices/projectsApiSlice";

import { useDispatch, useSelector } from "react-redux";
import { useMonaco } from "@monaco-editor/react";
import {
  setSelectedFile,
  setProjectFiles,
  setProjectVersion,
  setTabs,
  setActiveTab,
  openTab,
  syncTabsWithFiles,
  setEditorIsLoading,
  setUserIsOwner,
  setUnsavedFiles,
  setProjectName,
  setProjectDescription
} from "../../slices/editorSlice";

import { RootState } from "../../store";
import SideBarComponent from "./SideBar/SideBarComponent";
import prettier from "prettier/standalone";
import parserHtml from "prettier/plugins/html";
import parserBabel from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree";
import parserCss from "prettier/plugins/postcss";
import { getMonacoLang } from "./util";
import ProjectViewContainer from "./Interface/ProjectViewContainer";
import PreviewComponent from "./Preview/PreviewComponent";
import FileEditorComponent from "./FileEditor/FileEditorComponent";

const ProjectViewScreen = () => {
  const monaco = useMonaco();

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
    tabs,
    activeTab,
    lastClosedTab,
    unsavedFiles
  } = useSelector((state: RootState) => state.editor);

  const userIsOwner = ownership.data?.isOwner || false;

  useEffect(() => {
    const initialUnsaved: { [filename: string]: boolean } = {};
    projectFiles.forEach((f) => {
      initialUnsaved[f.fileName] = false;
    });
    dispatch(setUnsavedFiles(initialUnsaved));
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

  const saveAllFiles = async () => {
    try {
      await updateProject({ projectFiles, projectName }).unwrap();
      dispatch(setProjectVersion(projectVersion + 1));
      dispatch(setUnsavedFiles({}));
    } catch (err) {}
  };

  const formatAndSaveAllFiles = async () => {
    // maybe encapsulate this somewhere else
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
      dispatch(setUnsavedFiles({}));
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
            dispatch(setUnsavedFiles({
              ...unsavedFiles,
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
      dispatch(setUnsavedFiles({
        ...unsavedFiles,
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
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [userIsOwner, projectFiles, projectName, projectVersion]);

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

      if (currentReduxFiles.length === 0 || projectData.data.projectId !== projectName) {
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
                dispatch(setUnsavedFiles({
                  ...unsavedFiles,
                  [serverFile.fileName]: true
                }));
                return { ...serverFile, fileContent: modelContent };
              }
            }
            if (existingFile.fileContent !== serverFile.fileContent) {
              dispatch(setUnsavedFiles({
                ...unsavedFiles,
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

      dispatch(setProjectName(projectData.data.projectName));
      dispatch(setProjectDescription(projectData.data.projectDescription));
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

  return (
    <ProjectViewContainer>
      <SideBarComponent userIsOwner={userIsOwner} />
      {paneState.open.editor && (
        <FileEditorComponent
          unsavedFiles={unsavedFiles}
          setUnsavedFiles={setUnsavedFiles}
          editorRef={editorRef}
          modelsRef={modelsRef}
          userIsOwner={userIsOwner} />
      )}
      {paneState.open.preview && (
        <PreviewComponent
          projectName={projectName}
          projectVersion={projectVersion}
        />
      )}
    </ProjectViewContainer>
  );
};

export default ProjectViewScreen;
