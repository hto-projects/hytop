import { Paper, Text } from "@mantine/core";
import { IProject } from "../../../../shared/types";
import { Link } from "react-router-dom";

interface ProjectListProps {
  projects: IProject[];
  loading?: boolean;
  error?: any;
  edit?: boolean;
}

const ProjectList = ({ projects, loading, error, edit = true }: ProjectListProps) => {
  const startUrl = edit ? "/e/" : `${import.meta.env.VITE_BACKEND_URL}/pf/`;

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return (
      <div style={{ color: "red" }}>
        Error loading projects. Maybe try logging out and in again?
        <pre>{` ` + JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return <div>No projects found</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        overflowY: "auto",
        maxHeight: "50vh"
      }}
    >
      {[...projects]
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
        .map((proj) => (
          <Paper
            key={proj.projectId}
            shadow="xs"
            p="md"
            component={Link}
            to={`${startUrl}${encodeURIComponent(proj.projectName)}`}
            style={{
              minWidth: 200,
              maxWidth: 260,
              cursor: "pointer",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
          >
            <Text
              size="lg"
              fw={700}
              mb={4}
              style={{
                color: "#fff"
              }}
            >
              {proj.projectName}
            </Text>
            {proj.projectDescription && (
              <Text
                size="sm"
                style={{
                  color: "#bbb"
                }}
              >
                {proj.projectDescription}
              </Text>
            )}
          </Paper>
        ))}
    </div>
  );
};

export default ProjectList;
