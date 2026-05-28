import { ActionIcon } from "@mantine/core";
import { Tooltip } from "@mantine/core";
import { SIDEBAR_ICON_MAP } from "../../constants";
import { useSelector } from "react-redux";
import { useComputedColorScheme } from "@mantine/core";

const SideBarButton = ({ name, isOn, onClick }) => {
  const { primaryColor } = useSelector((state: any) => state.theme);
  const theColorScheme: string = useComputedColorScheme("light");
  const darkMode: boolean = theColorScheme === "dark";

  return (
    <Tooltip label={name} position="right">
      <ActionIcon
        color={isOn ? primaryColor : darkMode ? "darkgray" : "gray"}
        variant={isOn ? "filled" : "subtle"}
        size="lg"
        onClick={onClick}
      >
        {SIDEBAR_ICON_MAP[name]}
      </ActionIcon>
    </Tooltip>
  );
};

export default SideBarButton;
