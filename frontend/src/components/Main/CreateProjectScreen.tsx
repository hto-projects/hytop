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
      <svg className={styles.svg} id="visual" viewBox="0 0 900 600" width="900" height="600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><rect x="0" y="0" width="900" height="600" fill="#001220"></rect><defs><linearGradient id="grad1_0" x1="33.3%" y1="0%" x2="100%" y2="100%"><stop offset="20%" stop-color="#656bcc" stop-opacity="1"></stop><stop offset="80%" stop-color="#656bcc" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad1_1" x1="33.3%" y1="0%" x2="100%" y2="100%"><stop offset="20%" stop-color="#656bcc" stop-opacity="1"></stop><stop offset="80%" stop-color="#2c4f91" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad1_2" x1="33.3%" y1="0%" x2="100%" y2="100%"><stop offset="20%" stop-color="#063156" stop-opacity="1"></stop><stop offset="80%" stop-color="#2c4f91" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad1_3" x1="33.3%" y1="0%" x2="100%" y2="100%"><stop offset="20%" stop-color="#063156" stop-opacity="1"></stop><stop offset="80%" stop-color="#001220" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad2_0" x1="0%" y1="0%" x2="66.7%" y2="100%"><stop offset="20%" stop-color="#656bcc" stop-opacity="1"></stop><stop offset="80%" stop-color="#656bcc" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad2_1" x1="0%" y1="0%" x2="66.7%" y2="100%"><stop offset="20%" stop-color="#2c4f91" stop-opacity="1"></stop><stop offset="80%" stop-color="#656bcc" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad2_2" x1="0%" y1="0%" x2="66.7%" y2="100%"><stop offset="20%" stop-color="#2c4f91" stop-opacity="1"></stop><stop offset="80%" stop-color="#063156" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad2_3" x1="0%" y1="0%" x2="66.7%" y2="100%"><stop offset="20%" stop-color="#001220" stop-opacity="1"></stop><stop offset="80%" stop-color="#063156" stop-opacity="1"></stop></linearGradient></defs><g transform="translate(900, 0)"><path d="M0 432.7C-49.2 397.6 -98.5 362.6 -137.8 332.6C-177.1 302.6 -206.4 277.6 -253.9 253.9C-301.3 230.1 -366.9 207.7 -399.7 165.6C-432.6 123.5 -432.6 61.7 -432.7 0L0 0Z" fill="#02223a"></path><path d="M0 324.5C-36.9 298.2 -73.9 272 -103.3 249.4C-132.8 226.9 -154.8 208.2 -190.4 190.4C-226 172.6 -275.2 155.8 -299.8 124.2C-324.4 92.6 -324.5 46.3 -324.5 0L0 0Z" fill="#164073"></path><path d="M0 216.3C-24.6 198.8 -49.2 181.3 -68.9 166.3C-88.5 151.3 -103.2 138.8 -126.9 126.9C-150.7 115.1 -183.5 103.8 -199.9 82.8C-216.3 61.7 -216.3 30.9 -216.3 0L0 0Z" fill="#475daf"></path><path d="M0 108.2C-12.3 99.4 -24.6 90.7 -34.4 83.1C-44.3 75.6 -51.6 69.4 -63.5 63.5C-75.3 57.5 -91.7 51.9 -99.9 41.4C-108.1 30.9 -108.2 15.4 -108.2 0L0 0Z" fill="#656bcc"></path></g><g transform="translate(0, 600)"><path d="M0 -432.7C62.7 -433 125.4 -433.3 165.6 -399.7C205.8 -366.1 223.4 -298.5 253.9 -253.9C284.3 -209.2 327.5 -187.4 359.4 -148.9C391.3 -110.4 412 -55.2 432.7 0L0 0Z" fill="#02223a"></path><path d="M0 -324.5C47 -324.8 94 -325 124.2 -299.8C154.3 -274.6 167.6 -223.9 190.4 -190.4C213.2 -156.9 245.6 -140.5 269.5 -111.6C293.5 -82.8 309 -41.4 324.5 0L0 0Z" fill="#164073"></path><path d="M0 -216.3C31.3 -216.5 62.7 -216.7 82.8 -199.9C102.9 -183.1 111.7 -149.3 126.9 -126.9C142.1 -104.6 163.7 -93.7 179.7 -74.4C195.7 -55.2 206 -27.6 216.3 0L0 0Z" fill="#475daf"></path><path d="M0 -108.2C15.7 -108.3 31.3 -108.3 41.4 -99.9C51.4 -91.5 55.9 -74.6 63.5 -63.5C71.1 -52.3 81.9 -46.8 89.8 -37.2C97.8 -27.6 103 -13.8 108.2 0L0 0Z" fill="#656bcc"></path></g></svg>
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
