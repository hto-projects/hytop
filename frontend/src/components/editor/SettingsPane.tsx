import { Paper, Group, Text, Box, Switch, Button } from "@mantine/core";
import {
  PiGearBold,
  PiFilesBold,
  PiCodeBold,
  PiMonitorBold
} from "react-icons/pi";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ColorPicker } from "@mantine/core";
import { setPrimaryColor } from "../../slices/themeSlice";
import {
  setMonacoTheme,
  setMonacoFont,
  setMonacoFontSize,
  setMonacoWordWrap,
  setPaneState
} from "../../slices/editorSlice";
import { Select, TextInput, NumberInput } from "@mantine/core";
import DarkModeToggle from "../DarkModeToggle";
import { useComputedColorScheme } from "@mantine/core";

const SettingsPane = ({
  MIN_PANE_WIDTH,
  DEFAULT_PANE_WIDTHS,
  width,
  onDragStart,
  onDragOver
}) => {
  const theColorScheme = useComputedColorScheme("light");
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  const monacoTheme = useSelector((state: any) => state.editor.monacoTheme);
  const monacoFont = useSelector((state: any) => state.editor.monacoFont);
  const monacoFontSize = useSelector(
    (state: any) => state.editor.monacoFontSize
  );
  const monacoWordWrap = useSelector(
    (state: any) => state.editor.monacoWordWrap
  );
  const paneState = useSelector((state: any) => state.editor.paneState);
  const dispatch = useDispatch();

  const paneTypes = [
    { key: "editor", icon: <PiCodeBold />, label: "Editor" },
    { key: "preview", icon: <PiMonitorBold />, label: "Preview" }
  ];

  const togglePane = (pane: string) => {
    dispatch(
      setPaneState({
        ...paneState,
        open: { ...paneState.open, [pane]: !paneState.open[pane] }
      })
    );
  };

  return (
    <Paper
      shadow="xs"
      p={0}
      style={{
        minWidth: MIN_PANE_WIDTH,
        maxWidth: 600,
        width: width || DEFAULT_PANE_WIDTHS.settings,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.1s",
        color: theColorScheme === "dark" ? "white" : undefined,
        backgroundColor: theColorScheme === "dark" ? "#181A1B" : undefined
      }}
      draggable
      onDragStart={() => onDragStart("settings")}
      onDragOver={(e) => onDragOver(e, "settings")}
    >
      <Group
        align="apart"
        px="sm"
        py="xs"
        style={{
          borderBottom:
            theColorScheme === "dark" ? "1px solid #333" : "1px solid #eee",
          background: theColorScheme === "dark" ? "#181A1B" : undefined
        }}
      >
        <Group gap={4}>
          <PiGearBold />
          <Text size="sm">Settings</Text>
        </Group>
      </Group>
      <Box
        style={{
          flex: 1,
          minHeight: 0,
          padding: 16,
          background: theColorScheme === "dark" ? "#181A1B" : undefined
        }}
      >
        <Text fw={700} mb="xs">
          Panes
        </Text>
        <Box mb="md">
          {paneTypes.map((p) => (
            <Button
              key={p.key}
              leftSection={p.icon}
              color={paneState.open[p.key] ? primaryColor : "gray"}
              variant={paneState.open[p.key] ? "filled" : "light"}
              size="xs"
              onClick={() => togglePane(p.key)}
              style={{
                marginRight: 8,
                marginBottom: 4,
                opacity: paneState.open[p.key] ? 1 : 0.7,
                fontWeight: paneState.open[p.key] ? 700 : 400
              }}
            >
              {p.label}
            </Button>
          ))}
        </Box>
        <Text fw={700} mb="xs" mt="md">
          Theme
        </Text>
        <Box
          style={{
            marginBottom: 16,
            display: "flex",
            alignItems: "flex-start",
            gap: 8
          }}
        >
          <ColorPicker
            format="hex"
            value={primaryColor}
            onChange={(color) => dispatch(setPrimaryColor(color))}
            swatches={["#656bcc", "#6cb15a", "#c9a0dc"]}
            withPicker
            fullWidth
          />
          <Box style={{ marginTop: 2 }}>
            <DarkModeToggle />
          </Box>
        </Box>
        <Text fw={700} mt="md" mb="xs">
          Editor
        </Text>
        <Box mb="sm">
          <Text size="sm" mb={4}>
            Theme
          </Text>
          <Select
            data={[
              { value: "vs-light", label: "Light" },
              { value: "vs-dark", label: "Dark" },
              { value: "hc-black", label: "High Contrast" }
            ]}
            value={monacoTheme}
            onChange={(value) => value && dispatch(setMonacoTheme(value))}
            size="sm"
            style={{
              width: "100%",
              color: theColorScheme === "dark" ? "#fff" : undefined
            }}
            styles={{
              input: { color: theColorScheme === "dark" ? "#fff" : undefined },
              dropdown: {
                background: theColorScheme === "dark" ? "#23272A" : undefined,
                color: theColorScheme === "dark" ? "#fff" : undefined
              },
              option: { color: theColorScheme === "dark" ? "#fff" : undefined }
            }}
          />
        </Box>
        <Box mb="sm">
          <Text size="sm" mb={4}>
            Font
          </Text>
          <Select
            searchable
            data={[
              { value: "Fira Mono, monospace", label: "Fira Mono" },
              { value: "Monaco, monospace", label: "Monaco" },
              { value: "Consolas, monospace", label: "Consolas" },
              {
                value: "Comic Sans MS, Comic Sans, cursive",
                label: "Comic Sans"
              },
              { value: "Courier New, monospace", label: "Courier New" },
              { value: "Roboto Mono, monospace", label: "Roboto Mono" },
              { value: "monospace", label: "Monospace (default)" }
            ]}
            value={monacoFont}
            onChange={(value) => value && dispatch(setMonacoFont(value))}
            placeholder="Fira Mono, monospace"
            size="sm"
            style={{ width: "100%" }}
            styles={{
              input: { color: theColorScheme === "dark" ? "#fff" : undefined },
              dropdown: {
                background: theColorScheme === "dark" ? "#23272A" : undefined,
                color: theColorScheme === "dark" ? "#fff" : undefined
              },
              option: { color: theColorScheme === "dark" ? "#fff" : undefined }
            }}
          />
        </Box>
        <Box mb="sm">
          <Text size="sm" mb={4}>
            Font Size
          </Text>
          <NumberInput
            min={10}
            max={32}
            value={monacoFontSize}
            onChange={(value) =>
              typeof value === "number" && dispatch(setMonacoFontSize(value))
            }
            size="sm"
            style={{ width: 100 }}
          />
        </Box>
        <Box mb="sm">
          <Text size="sm" mb={4}>
            Word Wrap
          </Text>
          <Switch
            checked={monacoWordWrap === "on"}
            onChange={(meow) =>
              dispatch(
                setMonacoWordWrap(meow.currentTarget.checked ? "on" : "off")
              )
            }
            label={monacoWordWrap === "on" ? "Enabled" : "Disabled"}
            size="sm"
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default SettingsPane;
