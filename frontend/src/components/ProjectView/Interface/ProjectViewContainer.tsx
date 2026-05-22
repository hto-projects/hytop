import { Box } from "@mantine/core";

const ProjectViewContainer = ({ children }) => {
  return (
    <Box
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <Box
        style={{
          flex: 1,
          display: "flex",
          width: "100%",
          minHeight: 0,
          background: "#f6f8fa",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ProjectViewContainer;
