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
import { useSelector } from "react-redux";
import { useUpdateProjectMutation } from "../../slices/projectsApiSlice";
import { useParams } from "react-router-dom";

const ExplorerPane = ({
  MIN_PANE_WIDTH,
  DEFAULT_PANE_WIDTHS,
  width,
  onDragStart,
  onDragOver,
  closePane,
  addFile,
  projectFiles: initialProjectFiles,
  selectedFile,
  handleFileSelect,
  startRename,
  unsavedFiles,
  renamingFile,
  renameValue,
  dispatch,
  setRenameValue,
  confirmRename,
  cancelRename,
  style
}) => {
  const theColorScheme = useComputedColorScheme("light");
  const [justCreatedFile, setJustCreatedFile] = React.useState<string | null>(
    null
  );
  const { showContextMenu } = useContextMenu();
  const { projectName } = useParams();
  const [updateProject] = useUpdateProjectMutation();
  const projectFiles = useSelector((state: any) => state.editor.projectFiles);

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
        minWidth: MIN_PANE_WIDTH,
        maxWidth: 3000,
        width: width || DEFAULT_PANE_WIDTHS.explorer,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.1s",
        ...style,
        color: theColorScheme === "dark" ? "white" : undefined,
        backgroundColor:
          theColorScheme === "dark" ? "#181A1B" : style?.backgroundColor
      }}
      draggable
      onDragStart={() => onDragStart("explorer")}
      onDragOver={(e) => onDragOver(e, "explorer")}
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
            onContextMenu={showContextMenu([
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
