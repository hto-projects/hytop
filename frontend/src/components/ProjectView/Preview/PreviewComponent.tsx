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
  PiArrowSquareOutBold,
  PiArrowsOutLineHorizontal,
  PiArrowsInLineHorizontal,
  PiArrowsClockwiseBold
} from "react-icons/pi";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPaneState, setProjectVersion } from "../../../slices/editorSlice";
import { RootState } from "../../../store";

const PreviewComponent = ({ projectName, projectVersion }) => {
  const previewUrl = `${import.meta.env.VITE_BACKEND_URL}/pf/${projectName}/`;
  const dispatch = useDispatch();

  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  const { paneState } = useSelector((state: RootState) => state.editor);
  const theColorScheme = useComputedColorScheme("light");
  
  const [bigPane, setBigPane] = useState(false);
  const paneIsOpen = paneState.open.preview;

  const closePreview = () => {
    dispatch(
      setPaneState({
        ...paneState,
        open: { ...paneState.open, preview: false }
      })
    );
  };

  const openPreview = () => {
    dispatch(
      setPaneState({
        ...paneState,
        open: { ...paneState.open, preview: true }
      })
    );
  };

  const previewIcon = (
    <Paper
    style={{
      background: theColorScheme === "dark" ? primaryColor : undefined,
      width: 50,
      height: 50,
      position: "absolute",
      right: paneIsOpen ? -50 : 0,
      color: theColorScheme === "dark" ? "white" : undefined,
      flexDirection: "column",
      transition: "right .25s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    }}
    onClick={openPreview}
  >
    <PiMonitorBold />
  </Paper>
  );

  return (
    <>
    {previewIcon}
      <Paper
        shadow="xs"
        p={0}
        style={{
          maxWidth: 3000,
          width: !paneIsOpen ? 0 : bigPane ? 800 : 400,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.25s",
          color: theColorScheme === "dark" ? "white" : undefined,
          backgroundColor: theColorScheme === "dark" ? "#181A1B" : undefined
        }}
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
          <ActionIcon variant="subtle" onClick={closePreview} size="sm">
            <PiXBold />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            onClick={() => setBigPane(!bigPane)}
            size="sm"
          >
            <Tooltip label={bigPane ? "Emsmallen" : "Embiggen"} position="top">
              {bigPane ? (
                <PiArrowsInLineHorizontal />
              ) : (
                <PiArrowsOutLineHorizontal />
              )}
            </Tooltip>
          </ActionIcon>
        </Group>
        <Box
          style={{
            padding: "8px",
            borderBottom:
              theColorScheme === "dark" ? "1px solid #333" : "1px solid #eee"
          }}
        >
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
            <Tooltip label="Refresh">
              <ActionIcon
                size="sm"
                color={primaryColor}
                onClick={() => dispatch(setProjectVersion(projectVersion + 1))}
                variant="transparent"
              >
                <PiArrowsClockwiseBold />
              </ActionIcon>
            </Tooltip>
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
    </>
  );
};

export default PreviewComponent;
