import {
  Group,
  Text,
  ActionIcon,
  useComputedColorScheme,
  TextInput
} from "@mantine/core";
import { SIDEBAR_ICON_MAP } from "../../constants";
import { PiCheckBold, PiFilePlusBold, PiXBold } from "react-icons/pi";
import { useState } from "react";

const FilesHeaderComponent = ({
  enableAddFile,
  isDuplicateRename,
  closePane,
  submitNewFile
}) => {
  const theColorScheme = useComputedColorScheme("light");
  const [addingNewFile, setAddingNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const toggleAddNewFile = () => {
    if (!addingNewFile) {
      setAddingNewFile(true);
    } else {
      setNewFileName("");
      setAddingNewFile(false);
    }
  };

  const handleSubmitNewFile = () => {
    if (isDuplicateRename(newFileName)) {
      return;
    }

    submitNewFile(newFileName);
    setNewFileName("");
    setAddingNewFile(false);
  };
  
  return (
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
        {SIDEBAR_ICON_MAP["Files"]}
        <Text size="sm">Files</Text>
      </Group>
      {enableAddFile && (
        <ActionIcon variant="subtle" onClick={toggleAddNewFile} size="sm">
          <PiFilePlusBold />
        </ActionIcon>
      )}
      <ActionIcon
        variant="subtle"
        onClick={() => closePane("explorer")}
        size="sm"
      >
        <PiXBold />
      </ActionIcon>
      {addingNewFile && (
        <Group>
          <TextInput
            autoFocus
            placeholder="e.g., file.html"
            value={newFileName}
            error={
              isDuplicateRename(newFileName)
                ? "File name already exists"
                : undefined
            }
            onChange={(e) => setNewFileName(e.target.value)}
            style={{
              width: "150px"
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmitNewFile();
              } else if (e.key === "Escape") {
                toggleAddNewFile();
              }
            }}
          ></TextInput>
          <ActionIcon
            disabled={newFileName == "" || isDuplicateRename(newFileName)}
            onClick={handleSubmitNewFile}
          >
            <PiCheckBold />
          </ActionIcon>
          <ActionIcon onClick={toggleAddNewFile} variant="outline">
            <PiXBold />
          </ActionIcon>
        </Group>
      )}
    </Group>
  );
};

export default FilesHeaderComponent;
