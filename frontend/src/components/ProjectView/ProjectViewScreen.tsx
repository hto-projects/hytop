import React, { useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  useCheckOwnershipQuery,
  useGetProjectQuery,
  useUpdateProjectMutation
} from "../../slices/projectsApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useMonaco } from "@monaco-editor/react";
import { Selection, type editor } from "monaco-editor";
import {
  setSelectedFile,
  setProjectFiles,
  setProjectVersion,
  setTabs,
  setActiveTab,
  openTab,
  setEditorIsLoading,
  setUserIsOwner,
  setUnsavedFiles,
  setProjectName,
  setProjectDescription,
  setProjectOwnerUserName
} from "../../slices/editorSlice";
import { RootState } from "../../store";
import SideBarComponent from "./SideBar/SideBarComponent";
import prettier from "prettier/standalone";
import parserHtml from "prettier/plugins/html";
import parserBabel from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree";
import parserCss from "prettier/plugins/postcss";
import ProjectViewContainer from "./Interface/ProjectViewContainer";
import PreviewComponent from "./Preview/PreviewComponent";
import FileEditorComponent from "./FileEditor/FileEditorComponent";
import { IProjectFile } from "../../../../shared/types";
import { getMonacoLang } from "./util";

const ProjectViewScreen: React.FC = () => {
  const monaco = useMonaco();
  const location = useLocation();

  const { projectName } = useParams();
  const dispatch = useDispatch();

  const ownership: { data?: { isOwner: boolean } } =
    useCheckOwnershipQuery(projectName);
  const projectData: {
    data?: {
      projectId: string;
      projectName: string;
      projectDescription: string;
      projectFiles: IProjectFile[];
      ownerUsername: string;
    };
  } = useGetProjectQuery(projectName);
  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  // Reference to the Monaco Editor instance, persists across re-renders, set in FileEditorComponent
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);

  // An array of filenames mapped to Monaco Models, persists across re-renders, created/updated in FileEditorComponent
  const modelsRef = useRef<{ [filename: string]: editor.ITextModel }>({});

  // Load from state
  const {
    paneState,
    projectFiles,
    projectVersion,
    tabs,
    activeTab,
    lastClosedTab,
    unsavedFiles
  } = useSelector((state: RootState) => state.editor);

  // User owns this project
  const userIsOwner: boolean = ownership.data?.isOwner || false;

  // State
  const [readyToSetTab, setReadyToSetTab] = React.useState<Boolean>(false);

  // Sets the projectFiles in Store based on the Monaco Models
  const setProjectFilesStoreFromMonacoModels: () => IProjectFile[] = () => {
    const newProjectFiles: IProjectFile[] = projectFiles.map(
      (file: IProjectFile) => {
        const model: editor.ITextModel | undefined =
          modelsRef.current[file.fileName];

        if (model) {
          const modelContent: string = model.getValue();
          if (modelContent !== file.fileContent) {
            return { ...file, fileContent: modelContent };
          }
        }

        return file;
      }
    );

    return newProjectFiles;
  };

  /**
   * Function exists because right now, for the format and save to work we're currently making the formatting edits to the models
   * directly (since trying to set new project files destroys the undo redo stack). But because of how the project is loaded, all the 
   * project files don't have corresponding models. A rewrite to how files are loaded should be on the radar.
   */
  const setMonacoModelsFromProjectFiles = (): [string, editor.ITextModel][] => {
    const monacoModels = projectFiles
      .map((file: IProjectFile): [string, editor.ITextModel] | null => {
        const uri = monaco.Uri.parse(`file:///${file.fileName}`);
        const preexistingModel = monaco.editor.getModel(uri);
        
        if (preexistingModel) {
          return [file.fileName, preexistingModel];
        }

        const model = monaco.editor.createModel(
          file.fileContent,
          getMonacoLang(file.fileName),
          uri
        );

        modelsRef.current[file.fileName] = model;
        return [file.fileName, model];
      });

    return monacoModels;
  }

  // Saves all files, sends to DB
  const saveAllFiles: () => Promise<void> = async () => {
    if (!userIsOwner) return;
    try {
      const syncedProjectFiles = setProjectFilesStoreFromMonacoModels();
      await updateProject({
        projectFiles: syncedProjectFiles,
        projectName
      }).unwrap();
      dispatch(setProjectFiles(syncedProjectFiles));
      dispatch(setProjectVersion(projectVersion + 1));
      dispatch(setUnsavedFiles({}));
    } catch (err) {}
  };

  // Formats and then saves all files
  const formatAndSaveAllFiles: () => Promise<void> = async () => {
    console.log('saving from here');
    if (!userIsOwner) return;
    const parserByFileExtension = new Map<
      string,
      { parser: string; plugins: any[] }
    >([
      ["html", { parser: "html", plugins: [parserHtml] }],
      ["css", { parser: "css", plugins: [parserCss] }],
      ["js", { parser: "babel", plugins: [parserBabel, parserEstree] }]
    ]);

    try {
      const formattedFiles: IProjectFile[] = [];

      for (const file of setProjectFilesStoreFromMonacoModels()) {
        const fileExtension: string = file.fileName.split(".").pop() || "";
        const config: { parser: string; plugins: any[] } | undefined =
          parserByFileExtension.get(fileExtension);
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

      // In order to not break the undo stack we have to write the edits into the models directly
      const monacoModels = setMonacoModelsFromProjectFiles();
      for (const entry of monacoModels) {
        const [modelName, model] = entry;
        model.pushEditOperations(
          [], 
          [{
            range: model.getFullModelRange(),
            text: formattedFiles.find((projectFile) => projectFile.fileName === modelName).fileContent
          }], 
          null
        );
      }

      const syncedProjectFiles = setProjectFilesStoreFromMonacoModels();
      await updateProject({
        projectFiles: syncedProjectFiles,
        projectName
      }).unwrap();
      dispatch(setProjectFiles(syncedProjectFiles));
      dispatch(setProjectVersion(projectVersion + 1));
      dispatch(setUnsavedFiles({}));
    } catch (err) {
      console.error(err);
    }
  };

  // Dispose Monaco Models on unmount
  useEffect(() => {
    return () => {
      if (monaco) {
        monaco.editor.getModels().forEach((model) => model.dispose());
        modelsRef.current = {};
      }
    };
  }, [monaco, location]);

  // Setup Ctrl+S to save all
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (userIsOwner && e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveAllFiles();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // remove listener on dismount
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [userIsOwner, projectFiles, projectName, projectVersion]);

  // Setup event to save all files at the window level (this is triggered from Header)
  useEffect(() => {
    const handler = () => {
      if (userIsOwner) saveAllFiles();
    };
    window.addEventListener("saveAllFiles", handler);
    return () => window.removeEventListener("saveAllFiles", handler);
  }, [userIsOwner, projectFiles, projectName, projectVersion]);

  // Setup event to format and save at the window level (this is triggered from Header)
  useEffect(() => {
    const handler = () => {
      formatAndSaveAllFiles();
    };
    window.addEventListener("formatAndSaveAllFiles", handler);
    return () => window.removeEventListener("formatAndSaveAllFiles", handler);
  });

  // Update Store when userIsOwner changes
  useEffect(() => {
    dispatch(setUserIsOwner(userIsOwner));
  }, [userIsOwner, dispatch]);

  // Update Store when isLoading changes
  useEffect(() => {
    dispatch(setEditorIsLoading(isLoading));
  }, [isLoading, dispatch]);

  // localStorage keys for tab config
  const localStorageSelectedFile: string = `hytop_selectedFile_${projectName}`;
  const localStorageTabs: string = `hytop_tabs_${projectName}`;

  // This runs initially when new projectData is loaded from the query
  useEffect(() => {
    if (!projectData.data) {
      return;
    }

    modelsRef.current = {};
    dispatch(setProjectFiles(projectData.data.projectFiles));
    dispatch(setProjectOwnerUserName(projectData.data.ownerUsername));
    setReadyToSetTab(true);
    dispatch(setProjectName(projectData.data.projectName));
    dispatch(setProjectDescription(projectData.data.projectDescription));
  }, [projectData?.data]);

  // Load Initial Tab Configuration from localStorage
  useEffect(() => {
    if (!readyToSetTab) return;

    let savedTabs: string[] = [];
    const locallyStoredTabs: string | null =
      localStorage.getItem(localStorageTabs);
    if (locallyStoredTabs) {
      savedTabs = JSON.parse(locallyStoredTabs);
    }

    let selectedTab: string | null = localStorage.getItem(
      localStorageSelectedFile
    );
    const fileNames: string[] = projectFiles.map((f) => f.fileName);
    if (!fileNames.length) return;

    if (!fileNames.includes(selectedTab)) {
      selectedTab = fileNames[0];
    }

    const validTabs: string[] = savedTabs.filter((tab) =>
      fileNames.includes(tab)
    );
    if (validTabs.length > 0) {
      dispatch(setTabs(validTabs));
    } else {
      dispatch(setTabs([fileNames[0]]));
    }

    dispatch(setActiveTab(selectedTab));
    dispatch(setSelectedFile(selectedTab));
    setReadyToSetTab(false);
  }, [readyToSetTab]);

  // active tab changed, persist to localStorage
  useEffect(() => {
    if (activeTab) {
      localStorage.setItem(localStorageSelectedFile, activeTab);
    }
  }, [activeTab]);

  // tabs changed, persist to localStorage
  useEffect(() => {
    if (tabs && tabs.length) {
      localStorage.setItem(localStorageTabs, JSON.stringify(tabs));
    }
  }, [tabs]);

  // Handle situation where editor is open but no tab is selected
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

  // Component
  return (
    <ProjectViewContainer>
      <SideBarComponent userIsOwner={userIsOwner} />
      <FileEditorComponent
        showing={paneState.open.editor}
        unsavedFiles={unsavedFiles}
        editorRef={editorRef}
        modelsRef={modelsRef}
        userIsOwner={userIsOwner}
      />
      <PreviewComponent
        projectName={projectName}
        projectVersion={projectVersion}
      />
    </ProjectViewContainer>
  );
};

export default ProjectViewScreen;
