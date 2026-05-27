import { useDispatch, useSelector } from "react-redux";
import EditorPane from "./EditorPane";
import { RootState } from "../../../store";
import {
  setProjectVersion
} from "../../../slices/editorSlice";
import { useUpdateProjectMutation } from "../../../slices/projectsApiSlice";
import { useParams } from "react-router-dom";
import { useMonaco } from "@monaco-editor/react";

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

  const { projectFiles, projectVersion, activeTab, tabs } = useSelector(
    (state: RootState) => state.editor
  );

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
      tabs={tabs}
      unsavedFiles={unsavedFiles}
      activeTab={activeTab}
      saveCurrentFile={saveCurrentFile}
      editorRef={editorRef}
      monaco={monaco}
      userIsOwner={userIsOwner}   />
  );
};

export default FileEditorComponent;
