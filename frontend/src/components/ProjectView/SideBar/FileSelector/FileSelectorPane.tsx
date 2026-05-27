import { Box, useComputedColorScheme } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateProjectMutation } from "../../../../slices/projectsApiSlice";
import { useParams } from "react-router-dom";
import { SIDEBAR_WIDTH } from "../../constants";
import { RootState } from "../../../../store";
import {
  setActiveTab,
  setProjectFiles,
  setProjectVersion,
  setSelectedFile,
  setTabs,
  setUnsavedFiles
} from "../../../../slices/editorSlice";
import FileNameComponent from "./FileNameComponent";
import FilesHeaderComponent from "./FilesHeaderComponent";

const FileSelectorPane = ({ closePane, userIsOwner }) => {
  const dispatch = useDispatch();
  const { projectName } = useParams();

  const isDuplicateRename = (renameValue, ignore = "") => {
    return projectFiles.some(
      (p) =>
        p.fileName.toLowerCase() === renameValue.trim().toLowerCase() &&
        p.fileName !== ignore
    );
  };

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
    dispatch({
      type: "editor/deleteFile",
      payload: fileName
    });
    const updatedFiles = projectFiles.filter((f) => f.fileName !== fileName);
    await updateProject({
      projectFiles: updatedFiles,
      projectName
    }).unwrap();
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
    dispatch(setSelectedFile(newFileName));
    dispatch(setActiveTab(newFileName));
  };

  return (
    <Box
      p={0}
      style={{
        width: SIDEBAR_WIDTH,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.1s",
        color: theColorScheme === "dark" ? "white" : undefined,
        backgroundColor: theColorScheme === "dark" ? "#181A1B" : "white"
      }}
    >
      <FilesHeaderComponent
        enableAddFile={userIsOwner}
        isDuplicateRename={isDuplicateRename}
        closePane={closePane}
        submitNewFile={submitNewFile}
      />
      <Box style={{ flex: 1, overflowY: "auto" }}>
        {projectFiles.map((file) => (
          <FileNameComponent
            key={file.fileName}
            fileName={file.fileName}
            selected={selectedFile === file.fileName}
            unsaved={!!unsavedFiles[file.fileName]}
            isDuplicateRename={isDuplicateRename}
            contextMenuEnabled={userIsOwner}
            updateFileName={handleUpdateFileName}
            handleDeleteFile={handleDeleteFile}
          ></FileNameComponent>
        ))}
      </Box>
    </Box>
  );
};

export default FileSelectorPane;
