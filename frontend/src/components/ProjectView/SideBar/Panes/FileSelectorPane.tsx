import {
  Group,
  Box,
  Text,
  Menu,
  ActionIcon,
  TextInput,
  useComputedColorScheme
} from "@mantine/core";
import {
  PiFilesBold,
  PiFilePlusBold,
  PiFileHtml,
  PiFileCss,
  PiFileJs,
  PiXBold,
  PiDotOutlineFill,
  PiPencilBold,
  PiTrashBold
} from "react-icons/pi";
import React from "react";
import { useContextMenu } from "mantine-contextmenu";
import { useDispatch, useSelector } from "react-redux";
import { useCheckOwnershipQuery, useGetProjectQuery, useUpdateProjectMutation } from "../../../../slices/projectsApiSlice";
import { useParams } from "react-router-dom";
import { SIDEBAR_WIDTH } from "../../constants";
import { RootState } from "../../../../store";
import { openTab, setActiveTab, setProjectFiles, setProjectVersion, setRenameFile, setRenameValue, setRenamingFile, setSelectedFile, setTabs } from "../../../../slices/editorSlice";
import { useMonaco } from "@monaco-editor/react";

const ExplorerPane = ({
  closePane,
  modelsRef,
  userIsOwner
}) => {
  const dispatch = useDispatch();
  const monaco = useMonaco();
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

  const { projectName } = useParams();

  const {
    selectedFile,
    projectFiles,
    projectVersion,
    renamingFile,
    renameValue,
    tabs,
    activeTab,
  } = useSelector((state: RootState) => state.editor);

  const handleFileSelect = (filename: string) => {
      dispatch(openTab(filename));
      dispatch(setSelectedFile(filename));
    }; // should be in ExplorerPane
  
    const startRename = (filename: string) => {
      if (userIsOwner) {
        dispatch(setRenamingFile(filename));
        dispatch(setRenameValue(filename));
      }
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

      const [unsavedFiles, setUnsavedFiles] = React.useState<{
        [filename: string]: boolean;
      }>({});
  const theColorScheme = useComputedColorScheme("light");
  const [justCreatedFile, setJustCreatedFile] = React.useState<string | null>(
    null
  );
  const { showContextMenu } = useContextMenu();
  const [updateProject] = useUpdateProjectMutation();

  React.useEffect(() => {
    if (renamingFile && projectFiles.some((r) => r.fileName === renamingFile)) {
      setJustCreatedFile(renamingFile);
    }
  }, [renamingFile, projectFiles.map((rs) => rs.fileName).join(",")]);

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

  const isDuplicateRename =
    !!renameValue &&
    projectFiles.some(
      (the) =>
        the.fileName.toLowerCase() === renameValue.trim().toLowerCase() &&
        the.fileName !== renamingFile
    );

  const handleConfirmRename = (cherrycola) => {
    if (isDuplicateRename) {
      return;
    }
    confirmRename(cherrycola);
    setJustCreatedFile(null);
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
        backgroundColor:
          theColorScheme === "dark" ? "#181A1B" : "white"
      }}
    >
      <Group
        align="apart"
        px="sm"
        py="xs"
        style={{
          borderBottom:
            theColorScheme === "dark" ? "1px solid #333" : "1px solid #eee"
        }}
      >
        <Group gap={4}>
          <PiFilesBold />
          <Text size="sm">Files</Text>
        </Group>
        {userIsOwner && (
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
        )}
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
                selectedFile === file.fileName
                  ? theColorScheme === "dark"
                    ? "#23272A"
                    : "#f3f3f3"
                  : undefined,
              color:
                selectedFile === file.fileName && theColorScheme === "dark"
                  ? "#fff"
                  : undefined,
              fontWeight: selectedFile === file.fileName ? 600 : 400,
              display: "flex",
              alignItems: "center"
            }}
            onClick={(e) => {
              if (
                selectedFile === file.fileName &&
                renamingFile !== file.fileName
              ) {
                startRename(file.fileName);
              } else {
                handleFileSelect(file.fileName);
              }
            }}
            onContextMenu={userIsOwner && showContextMenu([
              {
                key: "rename",
                icon: <PiPencilBold size={14} />,
                title: "Rename",
                onClick: () => startRename(file.fileName)
              },
              {
                key: "delete",
                icon: <PiTrashBold size={14} />,
                title: "Delete",
                color: "red",
                onClick: () => handleDeleteFile(file.fileName)
              }
            ])}
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
                error={isDuplicateRename ? "Filename already exists" : false}
                ref={(input) => {
                  if (input) {
                    const match = file.fileName.match(/^(.*?)(\.[^.]*)?$/);
                    const matchymatcher =
                      match && match[2]
                        ? match[1].length
                        : file.fileName.length;
                    if (
                      justCreatedFile === file.fileName &&
                      !(input as any).__autoSelected
                    ) {
                      setTimeout(() => {
                        input.setSelectionRange(0, matchymatcher);
                        (input as any).__autoSelected = true;
                      }, 0);
                    } else if (!(input as any).__cursorSet) {
                      setTimeout(() => {
                        input.setSelectionRange(matchymatcher, matchymatcher);
                        (input as any).__cursorSet = true;
                      }, 0);
                    }
                  }
                }}
                onBlur={handleConfirmRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleConfirmRename(e);
                  } else if (e.key === "Escape") {
                    cancelRename();
                    setJustCreatedFile(null);
                  }
                }}
                styles={{
                  input: {
                    padding: "2px 6px",
                    fontSize: "14px",
                    height: "24px",
                    minWidth: "80px",
                    borderColor: isDuplicateRename ? "#ff4d4f" : undefined
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
    </Box>
  );
};

export default ExplorerPane;
