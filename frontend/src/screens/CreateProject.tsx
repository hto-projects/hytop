import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useCreateProjectMutation } from "../slices/projectsApiSlice";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  Textarea,
  Center,
  useComputedColorScheme,
  Box
} from "@mantine/core";
import Button from "../components/Button";
import Logo from "../components/Logo";

const CreateProjectScreen = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [createdProjectName, setCreatedProjectName] = useState("");

  const [createProject, { isLoading }] = useCreateProjectMutation();
  const redirect = useNavigate();

  const theColorSchemeish = useComputedColorScheme("light");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await createProject({
        projectName,
        projectDescription
      }).unwrap();
      toast.success(res.message);
      window.open(`/e/${res.projectName}`, "_blank");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: theColorSchemeish === "dark" ? "#181A1B" : undefined,
        color: theColorSchemeish === "dark" ? "#fff" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto"
      }}
    >
      <Container
        fluid
        w={500}
        my={40}
        style={{
          background: "transparent",
          color: theColorSchemeish === "dark" ? "#fff" : undefined
        }}
      >
        <Paper
          shadow="md"
          p={30}
          radius="md"
          withBorder
          style={{
            background: theColorSchemeish === "dark" ? "#23272A" : undefined,
            color: theColorSchemeish === "dark" ? "#fff" : undefined
          }}
        >
          <Center mb="lg">
            <Logo svgPath="/favicon.svg" height="10em" />
          </Center>
          <Title
            order={2}
            ta="center"
            mb="md"
            style={{ color: theColorSchemeish === "dark" ? "#fff" : undefined }}
          >
            Create a New Project
          </Title>
          <form onSubmit={submitHandler}>
            <TextInput
              label="Project Name"
              description="Will be converted to URL-friendly format (lowercase, hyphens)"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              mb="md"
              size="md"
              autoFocus
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
              styles={{
                input: {
                  color: theColorSchemeish === "dark" ? "#fff" : undefined
                },
                label: {
                  color: theColorSchemeish === "dark" ? "#fff" : undefined
                }
              }}
            />
            <Center mt="md">
              <Button type="submit" size="md" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </Center>
          </form>
          {isLoading && (
            <Center mt="md">
              <Loader />
            </Center>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateProjectScreen;
