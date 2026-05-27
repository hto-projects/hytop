import { Box } from "@mantine/core";
import FileSelectorPane from "../FileSelector/FileSelectorPane";
import SettingsPane from "../ProjectSettings/ProjectSettingsPane";
import PreferencesPane from "../../../User/Preferences/PreferencesPane";

const SideBarPane = ({
  selectedPane,
  setSelectedPane,
  userIsOwner
}) => {
  let pane = null;
  switch (selectedPane) {
    case "Files":
      pane = (
        <FileSelectorPane
          closePane={() => setSelectedPane(null)}
          userIsOwner={userIsOwner}
        />
      );
      break;
    case "Settings":
      pane = <SettingsPane closePane={() => setSelectedPane(null)} />;
      break;
    case "Preferences":
      pane = <PreferencesPane closePane={() => setSelectedPane(null)} />;
      break;
  }

  return <Box style={{ display: "flex", height: "100%" }}>{pane}</Box>;
};

export default SideBarPane;
