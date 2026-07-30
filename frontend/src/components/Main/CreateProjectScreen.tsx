import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../Interface/Loader";
import { useCreateProjectMutation } from "../../slices/projectsApiSlice";
import {
  Container,
  Paper,
  Title,
  TextInput,
  Textarea,
  Center,
  useComputedColorScheme,
  Box,
  Radio,
  Group,
  Text
} from "@mantine/core";
import Button from "../Interface/Button";
import Logo from "../Interface/Logo";

import styles from "./CreateProjectScreen.module.css";

const CreateProjectScreen = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [copyingProjectName, setCopyingProjectName] = useState("");
  const [projectType, setProjectType] = useState("html");

  const [createProject, { isLoading }] = useCreateProjectMutation();

  const theColorSchemeish = useComputedColorScheme("light");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
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
            description="Will be converted to URL-friendly format (lowercase, hyphens)"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            autoFocus
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
          <Group className={styles.projectType}>
            <Text fw="bold" size="sm">Project Type</Text>
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
          </Group>
          <TextInput
            label="Copying Project"
            description="Enter the name of an existing project to copy"
            value={copyingProjectName}
            onChange={(e) => setCopyingProjectName(e.target.value)}
            mb="md"
            size="md"
            autoFocus
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
          <Button type="submit" size="md" disabled={isLoading}>
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
