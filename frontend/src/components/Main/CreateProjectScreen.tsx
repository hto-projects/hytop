import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../Interface/Loader";
import { useCreateProjectMutation } from "../../slices/projectsApiSlice";
import {
  Paper,
  Title,
  TextInput,
  Textarea,
  useComputedColorScheme,
  Box,
  Radio,
  Group,
  Text,
  Autocomplete,
  Checkbox,
} from "@mantine/core";
import Button from "../Interface/Button";
import Logo from "../Interface/Logo";

import styles from "./CreateProjectScreen.module.css";

const CreateProjectScreen = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [copyingProjectName, setCopyingProjectName] = useState("");
  const [projectType, setProjectType] = useState("html");
  const [displayStarterProjects, setDisplayStarterProjects] = useState(false);

  const [createProject, { isLoading }] = useCreateProjectMutation();

  const theColorSchemeish = useComputedColorScheme("light");

  const python = ["monte python", "woohoo"];
  const html = ["hey hey hey", "ho ho ho", "heee heee"];

  const starterProjects = [
    {
      group: "python",
      items: python
    },
    {
      group: "html",
      items: html
    },
  ];

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // const formData = new FormData(e.currentTarget);
      const res = await createProject({
        projectName,
        projectDescription,
        copyingProjectName,
        projectType 
      }).unwrap();
      toast.success(res.message);
      window.open(`/e/${res.projectName}`, "_blank");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Box className={styles.box}>
      <Paper 
        withBorder
        className={styles.paper}
      >
        <Group className={styles.header}>
          <Logo svgPath="/favicon.svg" height="10em" />
          <Title
            className={styles.title}
            mb="md"
            style={{ color: theColorSchemeish === "dark" ? "#fff" : undefined }}
          >
            Create a New Project
          </Title>
        </Group>
        <form
          className={styles.form}
          onSubmit={submitHandler}
        >
          <TextInput
            label="Project Name"
            placeholder="Project Name"
            description="Will be converted to URL-friendly format (lowercase, hyphens)"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            autoFocus
            className={styles.input}
            size="md"
            styles={{
              input: {
                color: theColorSchemeish === "dark" ? "#fff" : undefined
              },
              label: {
                color: theColorSchemeish === "dark" ? "#fff" : undefined
              }
            }}
          />
          <Group className={styles.projectType}>
            <Text fw="bold" size="md">Project Type</Text>
            <Group>
              <Radio
                name="language"
                value="python"
                label="Python"
                onClick={(e) => setProjectType(e.currentTarget.value)}
              />
              <Radio
                name="language"
                value="html"
                label="Web (HTML)"
                defaultChecked
                onClick={(e) => setProjectType(e.currentTarget.value)}
              />
            </Group>
            <Checkbox
              label="Start From Starter Project"
              onChange={(e) => {setDisplayStarterProjects(e.target.checked)}}
            />
          </Group>
          <Group 
            className={styles.starterProjects}
            hidden={!displayStarterProjects}
          >
            <Autocomplete
              label="Select your Starter Project"
              placeholder="Starter Project"
              name="starter projects"
              data={[
                ...starterProjects.filter((group) => group.group === projectType)
              ]}
              withScrollArea={false}
              styles={{ dropdown: { maxHeight: 200, overflowY: 'auto' } }}
              clearable
              mb="md"
              size="md"
              className={styles.autocomplete}
              classNames={{
                dropdown: styles.autocompleteDropdown,
              }}
              onChange={(e) => setCopyingProjectName(e)}
            />
          </Group>
          <Textarea
            label="Project Description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            autosize
            minRows={2}
            mb="md"
            size="md"
            className={styles.input}
            styles={{
              input: {
                color: theColorSchemeish === "dark" ? "#fff" : undefined
              },
              label: {
                color: theColorSchemeish === "dark" ? "#fff" : undefined
              }
            }}
          />
          <Button className={styles.submit} type="submit" size="md" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateProjectScreen;
