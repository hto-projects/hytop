import { PiXBold } from "react-icons/pi";
import { Paper, Group, Text, Box, Button, ActionIcon } from "@mantine/core";
import React from "react";
import { useSelector } from "react-redux";
import { TextInput } from "@mantine/core";
import { useComputedColorScheme } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setProjectDescription,
  setProjectName
} from "../../../../slices/editorSlice";
import { SIDEBAR_ICON_MAP, SIDEBAR_WIDTH } from "../../constants";
import {
  useChangeProjectNameMutation,
  useGetProjectIdQuery,
  useChangeProjectDescriptionMutation
} from "../../../../slices/projectsApiSlice";
import { toast } from "react-toastify";
import { RootState } from "../../../../store";

const ProjectSettingsComponent = ({ closePane }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { projectName, projectDescription } = useSelector(
    (state: RootState) => state.editor
  );

  const projectID = useGetProjectIdQuery(projectName, {
    skip: !projectName
  });

  const projectId = projectID.data?.projectId;

  const theColorScheme = useComputedColorScheme("light");
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);

  const [changeProjectName] = useChangeProjectNameMutation();
  const [changeProjectDescription] = useChangeProjectDescriptionMutation();

  const handleProjectNameChange = async (newName: string) => {
    if (!projectId || !newName || newName === projectName) return;

    try {
      const res = await changeProjectName({
        projectId,
        newProjectName: newName
      }).unwrap();
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

  const handleChangeProjectDescription = async (newDesc: string) => {
    if (!projectId) return;
    try {
      const res = await changeProjectDescription({
        projectId,
        newProjectDescription: newDesc
      }).unwrap();
      dispatch(setProjectDescription(res.projectDescription));
      toast.success("Successfully updated project description");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update project description");
    }
  };

  const [nameInput, setNameInput] = useState(projectName);
  const [descInput, setDescInput] = useState(projectDescription);

  React.useEffect(() => {
    setNameInput(projectName);
  }, [projectName]);

  React.useEffect(() => {
    setDescInput(projectDescription);
  }, [projectDescription]);

  const handleSave = async () => {
    if (nameInput !== projectName) {
      try {
        const result = await handleProjectNameChange(nameInput);
        if (result) {
          dispatch(setProjectName(nameInput));
        }
      } catch (error) {
        console.error("Error changing project name:", error);
      }
    }
    if (descInput !== projectDescription) {
      await handleChangeProjectDescription(descInput);
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
          {SIDEBAR_ICON_MAP["Settings"]}
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
                setNameInput(projectName);
                setDescInput(projectDescription || "");
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

export default ProjectSettingsComponent;
