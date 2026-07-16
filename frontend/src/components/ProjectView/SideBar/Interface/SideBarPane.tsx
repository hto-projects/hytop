import { Box, useComputedColorScheme } from "@mantine/core";
import FileSelectorComponent from "../FileSelector/FileSelectorComponent";
import ProjectSettingsComponent from "../ProjectSettings/ProjectSettingsComponent";
import PreferencesPane from "../../../User/Preferences/PreferencesPane";
import { SIDEBAR_WIDTH } from "../../constants";
import React from "react";
import Classroom from "../Classroom/Classroom";

const SideBarPane = ({ selectedPane, setSelectedPane, userIsOwner }) => {
  const theColorScheme = useComputedColorScheme("light");
  const [sideBarWidth, setSidebarWidth] = React.useState(SIDEBAR_WIDTH);

  React.useEffect(() => {
    if (selectedPane) {
      setSidebarWidth(SIDEBAR_WIDTH);
    } else {
      setSidebarWidth(0);
    }
  }, [selectedPane]);

  let pane = null;
  const closePane = () => setSelectedPane(null);
  switch (selectedPane) {
    case "Files":
      pane = (
        <FileSelectorComponent closePane={closePane} userIsOwner={userIsOwner} />
      );
      break;
    case "Settings":
      pane = <ProjectSettingsComponent closePane={closePane} />;
      break;
    case "Preferences":
      pane = <PreferencesPane closePane={closePane} />;
      break;
    case "Classroom":
      pane = <Classroom closePane={closePane} />;
      break;
  }

  return (
    <Box
      style={{
        display: "flex",
        height: "100%",
        width: sideBarWidth,
        transition: "width 0.2s",
        backgroundColor: theColorScheme === "dark" ? "#181A1B" : "white"
      }}
    >
      {pane}
    </Box>
  );
};

export default SideBarPane;
