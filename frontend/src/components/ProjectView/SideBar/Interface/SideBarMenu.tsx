import { Box } from "@mantine/core";
import SideBarButton from "./SideBarButton";

const SideBarMenu = ({ selectedPane, setSelectedPane, userIsOwner }) => {
  return (
    <Box
      style={{
        width: 48,
        minWidth: 48,
        maxWidth: 48,
        height: "100%",
        background: "#181A1B",
        borderRight: "1px solid #333",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 8,
        gap: 4,
        color: "white",
        boxShadow: "2px 0 0 0 #181A1B"
      }}
    >
      <SideBarButton
        name="Files"
        isOn={selectedPane === "Files"}
        onClick={() => setSelectedPane("Files")}
      />
      {userIsOwner && (
        <>
          <SideBarButton
            name="Settings"
            isOn={selectedPane === "Settings"}
            onClick={() => setSelectedPane("Settings")}
          />
          <SideBarButton
            name="Preferences"
            isOn={selectedPane === "Preferences"}
            onClick={() => setSelectedPane("Preferences")}
          />
        </>
      )}
    </Box>
  );
};

export default SideBarMenu;
