import { ActionIcon } from "@mantine/core";
import { Tooltip } from "@mantine/core";
import { SIDEBAR_ICON_MAP } from "../../constants";

const SideBarButton = ({name, isOn, onClick}) => {
  return (
    <Tooltip label={name} position="right">
      <ActionIcon
        color={isOn ? "blue" : "gray"}
        variant={isOn ? "filled" : "subtle"}
        size="lg"
        onClick={onClick}
      >
        {SIDEBAR_ICON_MAP[name]}
      </ActionIcon>
    </Tooltip>
  )
};

export default SideBarButton;
