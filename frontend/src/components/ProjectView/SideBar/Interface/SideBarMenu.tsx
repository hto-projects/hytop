import { Box } from "@mantine/core";
import SideBarButton from "./SideBarButton";
import { useComputedColorScheme } from "@mantine/core";
import { useState } from "react";

const SideBarMenu = ({ selectedPane, setSelectedPane, userIsOwner }) => {
  const theColorScheme: string = useComputedColorScheme("light");
  const darkMode: boolean = theColorScheme === "dark";

  const [notifyUtil, setNotifyUtil] = useState<boolean>(false);
  const [utilBeenSelected, setUtilBeenSelected] = useState<boolean>(false);

  setTimeout(() => {
    setNotifyUtil(true);
  }, 1000 * 60 * 10 + (Math.random() * 1000 * 60 * 10));

  return (
    <Box
      style={{
        minWidth: 48,
        maxWidth: 48,
        height: "100%",
        background: darkMode ? "#181A1B" : "#fff",
        borderRight: darkMode ? "1px solid #333" : "1px solid #ccc",
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
          <SideBarButton
            name="Classroom"
            isOn={selectedPane === "Classroom"}
            onClick={() => setSelectedPane("Classroom")}
          />
          <SideBarButton
            name="Util"
            isOn={selectedPane === "Util"}
            onClick={() => { setSelectedPane("Util"); setUtilBeenSelected(true); }}
            notify={!utilBeenSelected && notifyUtil}
          />
        </>
      )}
    </Box>
  );
};

export default SideBarMenu;
