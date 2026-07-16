import { PiFilesBold, PiGearBold, PiKeyboard, PiKeyboardBold, PiPencilBold, PiStudentBold } from "react-icons/pi";

const DEFAULT_PANE_WIDTHS = {
  explorer: 260,
  editor: 600,
  preview: 400,
  settings: 260,
  preferences: 260,
  classroom: 260
};

const MIN_PANE_WIDTH = 60;

const SIDEBAR_WIDTH = 280;

const SIDEBAR_ICON_MAP = {
  "Files": <PiFilesBold />,
  "Settings": <PiPencilBold />,
  "Preferences": <PiGearBold />,
  "Classroom": <PiStudentBold />
}

export {
  DEFAULT_PANE_WIDTHS,
  MIN_PANE_WIDTH,
  SIDEBAR_WIDTH,
  SIDEBAR_ICON_MAP
};
