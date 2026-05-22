import React from "react";
import SideBarMenu from "./Interface/SideBarMenu";
import SideBarPane from "./Interface/SideBarPane";
import { Box } from "@mantine/core";

const SideBarComponent = ({
  modelsRef,
  userIsOwner
}) => {
  const [selectedPane, setSelectedPane] = React.useState<
    "Files" | "Preferences" | "Settings" | null
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
        modelsRef={modelsRef}
        userIsOwner={userIsOwner}
      />
    </Box>
  );
};

export default SideBarComponent;
