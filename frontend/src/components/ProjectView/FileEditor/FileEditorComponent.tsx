import { useDispatch, useSelector } from "react-redux";
import EditorPane from "./EditorPane";
import TabBar from "./TabBar";
import { RootState } from "../../../store";
import React from "react";
import { closeTab, setActiveTab, setProjectVersion } from "../../../slices/editorSlice";
import { useUpdateProjectMutation } from "../../../slices/projectsApiSlice";
import { useParams } from "react-router-dom";
import { useMonaco } from "@monaco-editor/react";
import { getMonacoLang } from "../util";

const FileEditorComponent = ({
  editorRef,
  modelsRef,
  userIsOwner,
  unsavedFiles,
  setUnsavedFiles
}) => {
  const dispatch = useDispatch();
  const monaco = useMonaco();
  const [updateProject] = useUpdateProjectMutation();
  const { projectName } = useParams();
  
  const {
    projectFiles,
    projectVersion,
    tabs,
    activeTab,
  } = useSelector((state: RootState) => state.editor);

  const handleTabClick = (fileName: string) => {
    dispatch(setActiveTab(fileName));
  };

  const handleTabClose = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(closeTab(fileName));
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

  return (
    <EditorPane
      renderTabBar={() => (
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          unsavedFiles={unsavedFiles}
          handleTabClick={handleTabClick}
          handleTabClose={handleTabClose}
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
  );
};

export default FileEditorComponent;
