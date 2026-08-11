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
  const [copyingProjectName, setCopyingProjectName] = useState("");
  const [projectType, setProjectType] = useState("html");
  const [disableStarterProjects, setDisableStarterProjects] = useState(false);

  const [createProject, { isLoading }] = useCreateProjectMutation();

  const theColorSchemeish = useComputedColorScheme("light");

  const pythonProjectNames = [
    "simple-turtle",
    "py-print",
    "py-cya ",
  ];

  const htmlProjectNames = [
    "www",
    "aframe",
    "three-js-blank-game",
    "p5-cube-image",
    "tv-characters",
    "funk-playlist",
    "quiz-about-me",
  ];

  const starterProjects = [
    {
      group: "python",
      items: pythonProjectNames
    },
    {
      group: "html",
      items: htmlProjectNames
    },
  ];

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await createProject({
        projectName,
        projectDescription: "",
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
      <svg preserveAspectRatio="xMinYMin slice" className={styles.svg} id="visual" viewBox="0 0 960 540" width="960" height="540" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1"><rect x="0" y="0" width="960" height="540" fill="#001220"></rect><defs><linearGradient id="grad1_0" x1="43.8%" y1="0%" x2="100%" y2="100%"><stop offset="14.444444444444446%" stop-color="#656bcc" stop-opacity="1"></stop><stop offset="85.55555555555554%" stop-color="#656bcc" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad1_1" x1="43.8%" y1="0%" x2="100%" y2="100%"><stop offset="14.444444444444446%" stop-color="#656bcc" stop-opacity="1"></stop><stop offset="85.55555555555554%" stop-color="#2c4f91" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad1_2" x1="43.8%" y1="0%" x2="100%" y2="100%"><stop offset="14.444444444444446%" stop-color="#063156" stop-opacity="1"></stop><stop offset="85.55555555555554%" stop-color="#2c4f91" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad1_3" x1="43.8%" y1="0%" x2="100%" y2="100%"><stop offset="14.444444444444446%" stop-color="#063156" stop-opacity="1"></stop><stop offset="85.55555555555554%" stop-color="#001220" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad2_0" x1="0%" y1="0%" x2="56.3%" y2="100%"><stop offset="14.444444444444446%" stop-color="#656bcc" stop-opacity="1"></stop><stop offset="85.55555555555554%" stop-color="#656bcc" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad2_1" x1="0%" y1="0%" x2="56.3%" y2="100%"><stop offset="14.444444444444446%" stop-color="#2c4f91" stop-opacity="1"></stop><stop offset="85.55555555555554%" stop-color="#656bcc" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad2_2" x1="0%" y1="0%" x2="56.3%" y2="100%"><stop offset="14.444444444444446%" stop-color="#2c4f91" stop-opacity="1"></stop><stop offset="85.55555555555554%" stop-color="#063156" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad2_3" x1="0%" y1="0%" x2="56.3%" y2="100%"><stop offset="14.444444444444446%" stop-color="#001220" stop-opacity="1"></stop><stop offset="85.55555555555554%" stop-color="#063156" stop-opacity="1"></stop></linearGradient></defs><g transform="translate(960, 0)"><path d="M0 432C-54.5 411.5 -108.9 391 -149.6 361.2C-190.3 331.5 -217.3 292.6 -261.6 261.6C-306 230.7 -367.8 207.6 -399.1 165.3C-430.4 123 -431.2 61.5 -432 0L0 0Z" fill="#02223a"></path><path d="M0 324C-40.8 308.6 -81.7 293.2 -112.2 270.9C-142.7 248.6 -162.9 219.5 -196.2 196.2C-229.5 173 -275.9 155.7 -299.3 124C-322.8 92.3 -323.4 46.1 -324 0L0 0Z" fill="#164073"></path><path d="M0 216C-27.2 205.7 -54.5 195.5 -74.8 180.6C-95.2 165.8 -108.6 146.3 -130.8 130.8C-153 115.3 -183.9 103.8 -199.6 82.7C-215.2 61.5 -215.6 30.8 -216 0L0 0Z" fill="#475daf"></path><path d="M0 108C-13.6 102.9 -27.2 97.7 -37.4 90.3C-47.6 82.9 -54.3 73.2 -65.4 65.4C-76.5 57.7 -92 51.9 -99.8 41.3C-107.6 30.8 -107.8 15.4 -108 0L0 0Z" fill="#656bcc"></path></g><g transform="translate(0, 540)"><path d="M0 -432C45.1 -396.6 90.2 -361.2 142.4 -343.7C194.5 -326.1 253.6 -326.4 299.8 -299.8C346 -273.2 379.2 -219.8 399.1 -165.3C419 -110.9 425.5 -55.4 432 0L0 0Z" fill="#02223a"></path><path d="M0 -324C33.8 -297.5 67.7 -270.9 106.8 -257.8C145.9 -244.6 190.2 -244.8 224.9 -224.9C259.5 -204.9 284.4 -164.8 299.3 -124C314.2 -83.2 319.1 -41.6 324 0L0 0Z" fill="#164073"></path><path d="M0 -216C22.6 -198.3 45.1 -180.6 71.2 -171.8C97.2 -163.1 126.8 -163.2 149.9 -149.9C173 -136.6 189.6 -109.9 199.6 -82.7C209.5 -55.4 212.7 -27.7 216 0L0 0Z" fill="#475daf"></path><path d="M0 -108C11.3 -99.2 22.6 -90.3 35.6 -85.9C48.6 -81.5 63.4 -81.6 75 -75C86.5 -68.3 94.8 -54.9 99.8 -41.3C104.7 -27.7 106.4 -13.9 108 0L0 0Z" fill="#656bcc"></path></g></svg>
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
            classNames={{ input: styles.inputTextBox }}
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
              onChange={(e) => {setDisableStarterProjects(e.target.checked)}}
            />
          </Group>
          <Group 
            className={styles.starterProjects}
          >
            <Autocomplete
              disabled={!disableStarterProjects}
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
                input: styles.inputTextBox
              }}
              onChange={(e) => setCopyingProjectName(e)}
            />
          </Group>
          <Button className={styles.submit} type="submit" size="md" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </Paper>
    </Box>
    // <Box
    //   style={{
    //     minHeight: "100vh",
    //     width: "100vw",
    //     background: theColorSchemeish === "dark" ? "#181A1B" : undefined,
    //     color: theColorSchemeish === "dark" ? "#fff" : undefined,
    //   }}
    // >
    //   <Container
    //     // w={500}
    //     style={{
    //       // width: "100vw",
    //       background: "transparent",
    //       color: theColorSchemeish === "dark" ? "#fff" : undefined
    //     }}
    //   >
    //     <Paper
    //       className={styles.paper}
    //       shadow="md"
    //       p={30}
    //       radius="md"
    //       withBorder
    //       style={{
    //         background: theColorSchemeish === "dark" ? "#23272A" : undefined,
    //         color: theColorSchemeish === "dark" ? "#fff" : undefined
    //       }}
    //     >
    //       <Group className={styles.group}>
    //         <Logo svgPath="/favicon.svg" height="10em" />
    //         <Title
    //           order={2}
    //           mb="md"
    //           style={{ color: theColorSchemeish === "dark" ? "#fff" : undefined }}
    //         >
    //           Create a New Project
    //         </Title>
    //       </Group>
    //       <form 
    //         onSubmit={submitHandler}
    //         style={{
    //           margin: "1rem"
    //         }}
    //       >
    //         <TextInput
    //           label="Project Name"
    //           description="Will be converted to URL-friendly format (lowercase, hyphens)"
    //           value={projectName}
    //           onChange={(e) => setProjectName(e.target.value)}
    //           required
    //           mb="md"
    //           size="md"
    //           autoFocus
    //           styles={{

    //             input: {
    //               color: theColorSchemeish === "dark" ? "#fff" : undefined
    //             },
    //             label: {
    //               color: theColorSchemeish === "dark" ? "#fff" : undefined
    //             }
    //           }}
    //         />

    //         <p>
    //           {" "}
    //           <b>Project Type</b>{" "}
    //         </p>

    //         <Radio
    //           name="language"
    //           value="python"
    //           label="Python"
    //           onClick={(e) => setProjectType(e.currentTarget.value)}
    //         />
    //         <Radio
    //           name="language"
    //           value="html"
    //           label="Web (HTML)"
    //           defaultChecked
    //           onClick={(e) => setProjectType(e.currentTarget.value)}
    //         />
    //         <TextInput
    //           label="Copying Project"
    //           description="Enter the name of an existing project to copy"
    //           value={copyingProjectName}
    //           onChange={(e) => setCopyingProjectName(e.target.value)}
    //           mb="md"
    //           size="md"
    //           autoFocus
    //           styles={{
    //             input: {
    //               color: theColorSchemeish === "dark" ? "#fff" : undefined
    //             },
    //             label: {
    //               color: theColorSchemeish === "dark" ? "#fff" : undefined
    //             }
    //           }}
    //         />

    //         <Textarea
    //           label="Project Description"
    //           value={projectDescription}
    //           onChange={(e) => setProjectDescription(e.target.value)}
    //           autosize
    //           minRows={2}
    //           mb="md"
    //           size="md"
    //           styles={{
    //             input: {
    //               color: theColorSchemeish === "dark" ? "#fff" : undefined
    //             },
    //             label: {
    //               color: theColorSchemeish === "dark" ? "#fff" : undefined
    //             }
    //           }}
    //         />
    //         <Center mt="md">
    //           <Button type="submit" size="md" disabled={isLoading}>
    //             {isLoading ? "Creating..." : "Create Project"}
    //           </Button>
    //         </Center>
    //       </form>
    //       {isLoading && (
    //         <Center mt="md">
    //           <Loader />
    //         </Center>
    //       )}
    //     </Paper>
    //   </Container>
    // </Box>
  );
};

/*
WEB
www
aframe
three-js-blank-game-1
p5-cube-image
tv-characters
funk-playlist
zine-machine-rowan-fyi
quiz-about-me
 
PYTHON
simple-turtle
py-print
py-cli 
*/

export default CreateProjectScreen;
