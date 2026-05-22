import { ActionIcon } from "@mantine/core";
import { Tooltip } from "@mantine/core";
import { PiFilesBold, PiGearBold, PiPencilBold } from "react-icons/pi";

const iconMap = {
  "Files": <PiFilesBold />,
  "Settings": <PiGearBold />,
  "Preferences": <PiPencilBold />
}

const SideBarButton = ({name, isOn, onClick}) => {
  return (
    <Tooltip label={name} position="right">
      <ActionIcon
        color={isOn ? "blue" : "gray"}
        variant={isOn ? "filled" : "subtle"}
        size="lg"
        onClick={onClick}
      >
        {iconMap[name]}
      </ActionIcon>
    </Tooltip>
  )
};

export default SideBarButton;
