import { Paper, Text, useComputedColorScheme } from "@mantine/core";
import { IProject } from "../../../shared/types";
import { Link } from "react-router-dom";

interface ProjectListProps {
  projects: IProject[];
  loading?: boolean;
  error?: any;
}

const ProjectList = ({ projects, loading, error }: ProjectListProps) => {
  const theColorScheme = useComputedColorScheme("light");

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error loading projects</div>;
  }

  if (!projects || projects.length === 0) {
    return <div>No projects found</div>;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      {[...projects]
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
        .map((proj) => (
          <Paper
            key={proj.projectId}
            shadow="xs"
            p="md"
            withBorder
            component={Link}
            to={`/e/${encodeURIComponent(proj.projectName)}`}
            style={{
              minWidth: 200,
              maxWidth: 260,
              cursor: "pointer",
              textDecoration: "none",
              background: theColorScheme === "dark" ? "#2E2E2E" : "#fff",
              transition: "all 0.2s ease"
            }}
            styles={{
              root: {
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow:
                    theColorScheme === "dark"
                      ? "0 4px 12px rgba(0,0,0,0.3)"
                      : "0 4px 12px rgba(0,0,0,0.1)"
                }
              }
            }}
          >
            <Text
              size="lg"
              fw={700}
              mb={4}
              style={{
                color: theColorScheme === "dark" ? "#fff" : "#000"
              }}
            >
              {proj.projectName}
            </Text>
            {proj.projectDescription && (
              <Text
                size="sm"
                style={{
                  color: theColorScheme === "dark" ? "#bbb" : "#666"
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
