import {
  Paper,
  Group,
  Text,
  ActionIcon,
  Tooltip,
  Box,
  CopyButton,
  useComputedColorScheme
} from "@mantine/core";
import {
  PiMonitorBold,
  PiXBold,
  PiLinkBold,
  PiArrowSquareOutBold
} from "react-icons/pi";
import React from "react";
import { useSelector } from "react-redux";

const PreviewPane = ({
  MIN_PANE_WIDTH,
  DEFAULT_PANE_WIDTHS,
  width,
  onDragStart,
  onDragOver,
  closePane,
  previewUrl,
  projectVersion
}) => {
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  const theColorScheme = useComputedColorScheme("light");
  return (
    <Paper
      shadow="xs"
      p={0}
      style={{
        minWidth: MIN_PANE_WIDTH,
        maxWidth: 3000,
        width: width || DEFAULT_PANE_WIDTHS.preview,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.1s",
        color: theColorScheme === "dark" ? "white" : undefined,
        backgroundColor: theColorScheme === "dark" ? "#181A1B" : undefined
      }}
      draggable
      onDragStart={() => onDragStart("preview")}
      onDragOver={(e) => onDragOver(e, "preview")}
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
          <PiMonitorBold />
          <Text size="sm">Preview</Text>
        </Group>
        <ActionIcon
          variant="subtle"
          onClick={() => closePane("preview")}
          size="sm"
        >
          <PiXBold />
        </ActionIcon>
      </Group>
      <Box style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
        <Group gap="xs" align="center">
          <Text
            style={{
              flex: 1,
              fontSize: "14px",
              color: "#495057",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {previewUrl}
          </Text>
          <CopyButton value={previewUrl}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? "Copied" : "Copy URL"} position="top">
                <ActionIcon
                  size="sm"
                  color={primaryColor}
                  onClick={copy}
                  variant="transparent"
                >
                  <PiLinkBold />
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
          <Tooltip label="Open in new tab" position="top">
            <ActionIcon
              size="sm"
              color={primaryColor}
              onClick={() => window.open(previewUrl, "_blank")}
              variant="transparent"
            >
              <PiArrowSquareOutBold />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Box>
      <Box style={{ flex: 1, minHeight: 0 }}>
        <iframe
          key={projectVersion}
          src={previewUrl}
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Project Preview"
        />
      </Box>
    </Paper>
  );
};

export default PreviewPane;
