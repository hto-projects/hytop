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
  Button,
  Center
} from "@mantine/core";

const CreateProjectScreen = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [createdProjectName, setCreatedProjectName] = useState("");

  const [createProject, { isLoading }] = useCreateProjectMutation();
  const redirect = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await createProject({
        projectName,
        projectDescription
      }).unwrap();
      toast.success(res.message);
      redirect(`/e/${res.projectName}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Container fluid w={500} my={40}>
      <Paper shadow="md" p={30} radius="md" withBorder>
        <Title order={2} ta="center" mb="md">
          Create a New Project
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Start a new Project
        </Text>
        <form onSubmit={submitHandler}>
          <TextInput
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            mb="md"
            size="md"
            autoFocus
          />
          <Textarea
            label="Project Description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            autosize
            minRows={2}
            mb="md"
            size="md"
          />
          <Center mt="md">
            <Button type="submit" size="md" loading={isLoading}>
              Create Project
            </Button>
          </Center>
          {createdProjectName && (
            <Center mt="lg">
              <Button
                component="a"
                href={`/e/${createdProjectName}`}
                color="green"
                variant="outline"
              >
                Edit Project
              </Button>
            </Center>
          )}
        </form>
        {isLoading && (
          <Center mt="md">
            <Loader />
          </Center>
        )}
      </Paper>
    </Container>
  );
};

export default CreateProjectScreen;
