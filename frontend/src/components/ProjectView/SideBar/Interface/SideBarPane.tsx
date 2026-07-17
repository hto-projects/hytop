import { Box, useComputedColorScheme } from "@mantine/core";
import FileSelectorComponent from "../FileSelector/FileSelectorComponent";
import ProjectSettingsComponent from "../ProjectSettings/ProjectSettingsComponent";
import PreferencesPane from "../../../User/Preferences/PreferencesPane";
import { SIDEBAR_WIDTH } from "../../constants";
import { useEffect, useState } from "react";
import Classroom from "../Classroom/Classroom";

const SideBarPane = ({ selectedPane, setSelectedPane, userIsOwner }) => {
  const theColorScheme = useComputedColorScheme("light");
  const [sideBarWidth, setSidebarWidth] = useState(SIDEBAR_WIDTH);

  const closePane = () => setSelectedPane(null);

  useEffect(() => {
    if (selectedPane) {
      setSidebarWidth(SIDEBAR_WIDTH);
    } else {
      setSidebarWidth(0);
    }
  }, [selectedPane]);

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
      <FileSelectorComponent hidden={selectedPane !== "Files"} closePane={closePane} userIsOwner={userIsOwner} />
      <ProjectSettingsComponent hidden={selectedPane !== "Settings"} closePane={closePane} />
      <PreferencesPane hidden={selectedPane !== "Preferences"} closePane={closePane} />
      <Classroom hidden={selectedPane !== "Classroom"} closePane={closePane} />
    </Box>
  );
};

export default SideBarPane;
