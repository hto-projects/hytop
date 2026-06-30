import { Title } from "@mantine/core";
import { useGetForksOfProjectQuery } from "../../slices/projectsApiSlice";
import ProjectList from "../User/ProjectList";
import { useParams } from "react-router-dom";

const ForksOfProject = () => {
  const { projectName } = useParams();

  const {
    data: forks = [],
    isLoading: forksLoading,
    error: forksError
  } = useGetForksOfProjectQuery(projectName);

  if (forksLoading) {
    return "Loading...";
  }

  if (forksError) {
    return `Error: ${forksError}`;
  }

  return (
    <div className="forks-project-list">
      <Title order={2} mb={16} ta="left">
        <i>Forks of</i> {projectName}
      </Title>
      <ProjectList projects={forks} loading={forksLoading} error={forksError} edit={false} />
    </div>
  );
};

export default ForksOfProject;
