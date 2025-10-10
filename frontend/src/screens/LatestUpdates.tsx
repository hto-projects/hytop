import { Title } from "@mantine/core";
import { useGetLatestProjectsQuery } from "../slices/projectsApiSlice";
import ProjectList from "../components/ProjectList";

const LatestUpdatesScreen = () => {
  const {
    data: latestProjects = [],
    isLoading: projectsLoading,
    error: projectsError
  } = useGetLatestProjectsQuery(null);

  return (
    <div>
      <Title order={2} mb={16} ta="left">
        Latest Projects
      </Title>
      <ProjectList
        projects={latestProjects}
        loading={projectsLoading}
        error={projectsError}
      />
    </div>
  );
};

export default LatestUpdatesScreen;
