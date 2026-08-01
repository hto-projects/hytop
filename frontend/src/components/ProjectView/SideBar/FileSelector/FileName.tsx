import { Box, TextInput, useComputedColorScheme, Text, BackgroundImage } from "@mantine/core";
import { modals } from "@mantine/modals";
import { PiCheckBold, PiDotOutlineFill, PiPencilBold, PiTrashBold, PiXBold } from "react-icons/pi";
import { useState } from "react";
import { useContextMenu } from "mantine-contextmenu";
import { useDispatch } from "react-redux";
import { openTab, setSelectedFile } from "../../../../slices/editorSlice";
import "@mantine/core/styles.css";

const FileName = ({
  fileName,
  selected,
  unsaved,
  handleDeleteFile,
  updateFileName,
  isDuplicateRename,
  contextMenuEnabled
}) => {
  const dispatch = useDispatch();
  
  const theColorScheme = useComputedColorScheme("light");
  const { showContextMenu } = useContextMenu();

  const [renaming, setRenaming] = useState<boolean>(false);
  const [renameValue, setRenameValue] = useState<string>(fileName);

  const submitRename = () => {
    if (isDuplicateRename(renameValue, fileName) || !renameValue.trim()) {
      setRenameValue(fileName);
      setRenaming(false);
      return;
    }

    setRenaming(false);
    updateFileName(renameValue, fileName);
  };

  const handleFileSelect = (filename: string) => {
    dispatch(openTab(filename));
    dispatch(setSelectedFile(filename));
  };

  const autoSelectName = (
    input: HTMLInputElement & { beenSelected?: boolean }
  ) => {
    if (input && !input.beenSelected) {
      const fileNameSplitOnExtension = fileName.match(/^(.*?)(\.[^.]*)?$/);
      let endSelectionPosition = fileName.length;
      if (fileNameSplitOnExtension.length == 3) {
        endSelectionPosition = fileNameSplitOnExtension[1].length;
      }

      setTimeout(() => {
        input.setSelectionRange(0, endSelectionPosition);
        input.beenSelected = true;
      }, 0);
    }
  };

  const openConfirmDeleteModal = () => modals.openConfirmModal({
    title: `Confirm Deletion`,
    children: (
      <Text size="sm">
        Are you sure you want to delete file "{fileName}"? This action cannot be undone.
      </Text>
    ),
    onConfirm: () => handleDeleteFile(fileName),
    onCancel: () => modals.closeAll(),
    labels: { 
      confirm: <PiCheckBold size={14} />, 
      cancel: <PiXBold size={14} />
    },
    style: {
      color: "#fff"
    }
  });

  return (
    <Box
      px="sm"
      py={6}
      style={{
        cursor: "pointer",
        background: selected
          ? theColorScheme === "dark"
            ? "#23272A"
            : "#f3f3f3"
          : undefined,
        color: selected && theColorScheme === "dark" ? "#fff" : undefined,
        fontWeight: selected ? 600 : 400,
        display: "flex",
        alignItems: "center"
      }}
      onClick={() => {
        if (selected && !renaming) {
          setRenaming(true);
        } else {
          handleFileSelect(fileName);
        }
      }}
      onContextMenu={
        contextMenuEnabled
          ? showContextMenu([
              {
                key: "rename",
                icon: <PiPencilBold size={14} />,
                title: "Rename",
                onClick: () => setRenaming(true)
              },
              {
                key: "delete",
                icon: <PiTrashBold size={14} />,
                title: "Delete",
                color: "red",
                onClick: () => {
                  openConfirmDeleteModal()
                }
              }
            ])
          : undefined
      }
    >
      {unsaved && (
        <PiDotOutlineFill
          color="#FFA94D"
          style={{ marginRight: 6, fontSize: 16 }}
        />
      )}
      {renaming ? (
        <TextInput
          value={renameValue}
          onChange={(e) => setRenameValue(e.currentTarget.value)}
          size="xs"
          autoFocus
          error={
            isDuplicateRename(renameValue, fileName)
              ? "File name already exists"
              : undefined
          }
          onBlur={submitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submitRename();
            } else if (e.key === "Escape") {
              setRenaming(false);
              setRenameValue(fileName);
            }
          }}
          ref={autoSelectName}
          styles={{
            input: {
              padding: "2px 6px",
              fontSize: "14px",
              height: "24px",
              minWidth: "80px",
              borderColor: isDuplicateRename(renameValue, fileName)
                ? "#ff4d4f"
                : undefined
            }
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        fileName
      )}
    </Box>
  );
};

export default FileName;
