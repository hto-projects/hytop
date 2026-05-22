import { PiGearBold, PiXBold } from "react-icons/pi";

import { Paper, Group, Text, Box, Button, ActionIcon } from "@mantine/core";
import React from "react";
import { useSelector } from "react-redux";
import { TextInput } from "@mantine/core";
import { useComputedColorScheme } from "@mantine/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentProjectName, setProjectDescription, setProjectName } from "../../../../slices/editorSlice";
import { SIDEBAR_WIDTH } from "../../constants";
import { useChangeProjectNameMutation, useGetProjectDescriptionQuery, useGetProjectIdQuery, useChangeProjectDescriptionMutation } from "../../../../slices/projectsApiSlice";
import { toast } from "react-toastify";

const SettingsPane = ({
  closePane
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { projectName } = useParams();
  const projectID = useGetProjectIdQuery(projectName, {
    skip: !projectName
  });
  const projectId = projectID.data?.projectId;
  const projectDescriptionData = useGetProjectDescriptionQuery(projectId, {
    skip: !projectId
  });

  const projectDescription = projectDescriptionData?.data?.projectDescription;
  const theColorScheme = useComputedColorScheme("light");
  const location = useLocation();
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);

  const [changeProjectName] = useChangeProjectNameMutation();
  const [changeProjectDescription] = useChangeProjectDescriptionMutation();

  const handleProjectNameChange = async (newName: string) => {
    if (!projectId || !newName || newName === currentProjectName) return;

    try {
      const res = await changeProjectName({
        projectId,
        newProjectName: newName
      }).unwrap();
      setCurrentProjectNamem(res.projectName);
      dispatch(setProjectName(res.projectName));

      if (res.projectName !== projectName) {
        navigate(`/e/${encodeURIComponent(res.projectName)}`, {
          replace: true
        });
      }

      toast.success("Successfully updated project name");
      return true;
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update project name");
      return false;
    }
  };

  const handleChangeProjDescFromTop = async (newDesc: string) => { // SettingsPane
      if (!projectId || !newDesc) return;
      try {
        const res = await changeProjectDescription({
          projectId,
          newProjectDescription: newDesc
        }).unwrap();
        setCurrentProjectDescription(res.projectDescription);
        dispatch(setProjectDescription(res.projectDescription));
        toast.success("Successfully updated project description");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to update project description");
      }
    };

  const match = location.pathname.match(/^\/([ec])\/([^/]+)$/);

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
    if (handleProjectNameChange && nameInput && nameInput !== effectiveProjectName) {
      try {
        const result = await handleProjectNameChange(nameInput);
        if (result) {
          didChange = true;
          dispatch(setCurrentProjectName(nameInput));
        }
      } catch (error) {
        console.error("Error changing project name:", error);
        didChange = false;
      }
    }
    if (handleChangeProjDescFromTop && descInput !== effectiveProjectDescription) {
      await handleChangeProjDescFromTop(descInput);
      didChange = true;
    }
    setEditing(false);
    if (didChange) {
      setDescInput(descInput);
    }
  };

  return (
    <Paper
      shadow="xs"
      p={0}
      style={{
        width: SIDEBAR_WIDTH,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.1s",
        color: theColorScheme === "dark" ? "white" : undefined,
        backgroundColor: theColorScheme === "dark" ? "#181A1B" : undefined,
        overflow: "hidden"
      }}
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
            description="Will be converted to URL-friendly format (lowercase, hyphens)"
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
              },
              description: {
                color: theColorScheme === "dark" ? "#888" : "#666",
                fontSize: 10
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
