import React from "react";
import SideBarMenu from "./Interface/SideBarMenu";
import SideBarPane from "./Interface/SideBarPane";
import { Box } from "@mantine/core";

const SideBarComponent = ({ userIsOwner, handleDroppedFiles }) => {
  const [selectedPane, setSelectedPane] = React.useState<
    "Files" | "Preferences" | "Settings" | "Classroom" | null
  >("Files");
  return (
    <Box style={{ display: "flex", height: "100%" }}>
      <SideBarMenu
        selectedPane={selectedPane}
        setSelectedPane={setSelectedPane}
        userIsOwner={userIsOwner}
      />
      <SideBarPane
        selectedPane={selectedPane}
        setSelectedPane={setSelectedPane}
        userIsOwner={userIsOwner}
        handleDroppedFiles={handleDroppedFiles}
      />
    </Box>
  );
};

export default SideBarComponent;
