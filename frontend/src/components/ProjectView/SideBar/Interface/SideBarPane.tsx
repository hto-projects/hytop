import { Box } from "@mantine/core";
import ExplorerPane from "../Panes/FileSelectorPane";
import SettingsPane from "../Panes/ProjectSettingsPane";
import PreferencesPane from "../../../User/Preferences/PreferencesPane";

const SideBarPane = ({
  modelsRef,
  selectedPane,
  setSelectedPane,
  userIsOwner
}) => {
  let pane = null;
  switch (selectedPane) {
    case "Files":
      pane = (
        <ExplorerPane
          closePane={() => setSelectedPane(null)}
          modelsRef={modelsRef}
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
