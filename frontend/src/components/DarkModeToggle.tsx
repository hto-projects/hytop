import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Tooltip
} from "@mantine/core";
import { PiMoonBold, PiSunBold } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { setMonacoTheme } from "../slices/editorSlice";

const DarkModeToggle = () => {
  const { setColorScheme } = useMantineColorScheme();
  const theColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true
  });
  const dispatch = useDispatch();

  const handleToggle = () => {
    const next = theColorScheme === "dark" ? "light" : "dark";
    setColorScheme(next);
    dispatch(setMonacoTheme(next === "dark" ? "vs-dark" : "vs-light"));
  };

  return (
    <Tooltip
      label={`Switch to ${theColorScheme === "dark" ? "light" : "dark"} mode`}
    >
      <ActionIcon
        onClick={handleToggle}
        variant="default"
        size="lg"
        aria-label="Toggle light/dark mode"
        style={{ marginLeft: 8 }}
      >
        {theColorScheme === "dark" ? (
          <PiSunBold size={20} />
        ) : (
          <PiMoonBold size={20} />
        )}
      </ActionIcon>
    </Tooltip>
  );
};

export default DarkModeToggle;
