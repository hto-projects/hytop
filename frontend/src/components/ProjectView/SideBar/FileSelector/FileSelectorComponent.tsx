import { Box, useComputedColorScheme } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateProjectMutation } from "../../../../slices/projectsApiSlice";
import { useParams } from "react-router-dom";
import { RootState } from "../../../../store";
import { toast } from "react-toastify";
import {
  setActiveTab,
  setProjectFiles,
  setProjectVersion,
  setSelectedFile,
  openTab,
  setTabs,
  setUnsavedFiles
} from "../../../../slices/editorSlice";
import FileName from "./FileName";
import FilesHeader from "./FilesHeader";

const FileSelectorComponent = ({ closePane, userIsOwner }) => {
  const dispatch = useDispatch();
  const { projectName } = useParams();

  // Load from Store
  const {
    selectedFile,
    projectFiles,
    projectVersion,
    tabs,
    activeTab,
    unsavedFiles
  } = useSelector((state: RootState) => state.editor);

  const theColorScheme = useComputedColorScheme("light");
  const [updateProject] = useUpdateProjectMutation();

  const isDuplicateRename = (renameValue, ignore = "") => {
    return projectFiles.some(
      (p) =>
        p.fileName.toLowerCase() === renameValue.trim().toLowerCase() &&
        p.fileName !== ignore
    );
  };

  const handleUpdateFileName = async (renameValue, renamingFile) => {
    if (
      renameValue &&
      renameValue !== renamingFile &&
      !projectFiles.some((y) => y.fileName === renameValue)
    ) {
      const updatedFiles = projectFiles.map((ts) =>
        ts.fileName === renamingFile ? { ...ts, fileName: renameValue } : ts
      );

      try {
        await updateProject({
          projectFiles: updatedFiles,
          projectName
        }).unwrap();
        dispatch(setProjectVersion(projectVersion + 1));
        dispatch(setUnsavedFiles({}));
        if (tabs.includes(renamingFile)) {
          dispatch(
            setTabs(
              tabs.map((tab) => (tab === renamingFile ? renameValue : tab))
            )
          );
        }
        if (activeTab === renamingFile) {
          dispatch(setActiveTab(renameValue));
        }
        dispatch(setProjectFiles(updatedFiles));
      } catch (err) {}
    }
  };

  const handleDeleteFile = async (fileName) => {
    const updatedFiles = projectFiles.filter((f) => f.fileName !== fileName);

    try {
      await updateProject({
        projectFiles: updatedFiles,
        projectName
      }).unwrap();

      dispatch(setProjectVersion(projectVersion + 1));
      dispatch(setUnsavedFiles({}));
      dispatch(setProjectFiles(updatedFiles));
    } catch (err) {
      toast.error("Error saving project, please manually save.");
    }
  };

  const submitNewFile = async (newFileName) => {
    const updatedFiles = [
      ...projectFiles,
      {
        fileName: newFileName,
        fileContent: ""
      }
    ];

    try {
      await updateProject({
        projectFiles: updatedFiles,
        projectName
      }).unwrap();
      dispatch(setProjectVersion(projectVersion + 1));
      dispatch(setUnsavedFiles({}));
      dispatch(setProjectFiles(updatedFiles));
    } catch (err) {}
    dispatch(openTab(newFileName));
  };

  return (
    <Box
      p={0}
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.1s",
        color: theColorScheme === "dark" ? "white" : undefined,
        backgroundColor: theColorScheme === "dark" ? "#181A1B" : "white"
      }}
    >
      <FilesHeader
        enableAddFile={userIsOwner}
        isDuplicateRename={isDuplicateRename}
        closePane={closePane}
        submitNewFile={submitNewFile}
      />
      <Box style={{ flex: 1, overflowY: "auto" }}>
        {projectFiles.map((file) => (
          <FileName
            key={file.fileName}
            fileName={file.fileName}
            selected={selectedFile === file.fileName}
            unsaved={!!unsavedFiles[file.fileName]}
            isDuplicateRename={isDuplicateRename}
            contextMenuEnabled={userIsOwner}
            updateFileName={handleUpdateFileName}
            handleDeleteFile={handleDeleteFile}
          ></FileName>
        ))}
      </Box>
    </Box>
  );
};

export default FileSelectorComponent;
