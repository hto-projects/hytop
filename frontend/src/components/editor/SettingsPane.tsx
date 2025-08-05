import { PiGearBold, PiXBold } from "react-icons/pi";

import { Paper, Group, Text, Box, Button, ActionIcon } from "@mantine/core";
import React from "react";
import { useSelector } from "react-redux";
import { TextInput } from "@mantine/core";
import { useComputedColorScheme } from "@mantine/core";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentProjectName } from "../../slices/editorSlice";

const SettingsPane = ({
  MIN_PANE_WIDTH,
  DEFAULT_PANE_WIDTHS,
  width,
  onDragStart,
  onDragOver,
  closePane,
  projectId,
  projectName,
  projectDescription,
  changeProjectName,
  changeProjectDescription
}) => {
  const theColorScheme = useComputedColorScheme("light");
  const location = useLocation();
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);

  const dispatch = useDispatch();

  const match = location.pathname.match(/^\/([ec])\/([^/]+)$/);
  const isEditor = !!match;

  const [currentProjectName, setCurrentProjectNamem] = useState(
    projectName || ""
  );
  const [currentProjectDescription, setCurrentProjectDescription] =
    useState("");

  useEffect(() => {
    if (projectName) {
      setCurrentProjectNamem(projectName);
    }
  }, [projectName]);

  useEffect(() => {
    if (projectDescription !== undefined) {
      setCurrentProjectDescription(projectDescription);
    }
  }, [projectDescription]);

  let routeProjectName = match ? match[2] : "";
  routeProjectName = decodeURIComponent(routeProjectName);

  const editorState = useSelector((state: any) => state.editor);
  const effectiveProjectName =
    projectName || editorState.projectName || routeProjectName;
  const effectiveProjectDescription =
    projectDescription || editorState.projectDescription || "";

  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(effectiveProjectName);
  const [descInput, setDescInput] = useState(effectiveProjectDescription);
  React.useEffect(() => {
    setNameInput(effectiveProjectName);
  }, [effectiveProjectName]);
  React.useEffect(() => {
    setDescInput(effectiveProjectDescription);
  }, [effectiveProjectDescription]);

  const handleSave = async () => {
    let didChange = false;
    if (changeProjectName && nameInput && nameInput !== effectiveProjectName) {
      if ((await changeProjectName(nameInput)) == false) {
        didChange = false;
      } else {
        didChange = true;
        dispatch(setCurrentProjectName(nameInput));
      }
    }
    if (changeProjectDescription && descInput !== effectiveProjectDescription) {
      await changeProjectDescription(descInput);

      didChange = true;
    }
    setEditing(false);
    if (didChange) {
      setNameInput(nameInput);
      setDescInput(descInput);
    }
  };

  return (
    <Paper
      shadow="xs"
      p={0}
      style={{
        minWidth: MIN_PANE_WIDTH,
        maxWidth: 600,
        width: width || DEFAULT_PANE_WIDTHS.settings,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.1s",
        color: theColorScheme === "dark" ? "white" : undefined,
        backgroundColor: theColorScheme === "dark" ? "#181A1B" : undefined,
        overflow: "hidden"
      }}
      // draggable
      // onDragStart={() => onDragStart("settings")}
      // onDragOver={(e) => onDragOver(e, "settings")}
    >
      <Group
        align="apart"
        px="sm"
        py="xs"
        style={{
          borderBottom:
            theColorScheme === "dark" ? "1px solid #333" : "1px solid #eee",
          background: theColorScheme === "dark" ? "#181A1B" : undefined
        }}
      >
        <Group gap={4}>
          <PiGearBold />
          <Text size="sm">Settings</Text>
        </Group>
        <ActionIcon
          variant="subtle"
          onClick={() => closePane("settings")}
          size="sm"
        >
          <PiXBold />
        </ActionIcon>
      </Group>
      <Box
        style={{
          flex: 1,
          minHeight: 0,
          padding: 16,
          background: theColorScheme === "dark" ? "#181A1B" : undefined,
          overflowY: "auto",
          height: "100%"
        }}
      >
        <Text fw={700} mb="xs">
          Edit Project Details
        </Text>
        <Box p={8} style={{ minWidth: 240 }}>
          <TextInput
            label="Project Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.currentTarget.value)}
            size="xs"
            mb="xs"
            autoFocus
            styles={{
              input: {
                color: theColorScheme === "dark" ? "#fff" : undefined,
                fontFamily: "monospace"
              },
              label: {
                color: theColorScheme === "dark" ? "#fff" : undefined,
                fontSize: 12
              }
            }}
          />
          <TextInput
            label="Project Description"
            value={descInput}
            onChange={(e) => setDescInput(e.currentTarget.value)}
            size="xs"
            mb="xs"
            styles={{
              input: {
                color: theColorScheme === "dark" ? "#fff" : undefined,
                fontFamily: "monospace"
              },
              label: {
                color: theColorScheme === "dark" ? "#fff" : undefined,
                fontSize: 12
              }
            }}
          />
          <Group mt="xs" gap={8}>
            <Button
              size="xs"
              color={primaryColor}
              onClick={handleSave}
              style={{ fontWeight: 600 }}
            >
              Save
            </Button>
            <Button
              size="xs"
              variant="light"
              onClick={() => {
                setNameInput(projectName || routeProjectName);
                setDescInput(projectDescription || "");
                setEditing(false);
              }}
            >
              Cancel
            </Button>
          </Group>
        </Box>
      </Box>
    </Paper>
  );
};
export default SettingsPane;
