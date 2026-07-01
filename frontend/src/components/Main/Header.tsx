import {
  ActionIcon,
  Group,
  Tooltip,
  Text,
  Loader,
  useComputedColorScheme,
  Button,
  Menu
} from "@mantine/core";
import {
  PiFloppyDiskBold,
  PiGitForkBold,
  PiHouseBold,
  PiMagicWandBold
} from "react-icons/pi";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  const theColorScheme = useComputedColorScheme("light");
  const { userInfo } = useSelector((state: any) => state.auth);

  const isEditor = location.pathname.startsWith("/e/");
  let routeProjectName = isEditor ? location.pathname.substring(3) : "";
  routeProjectName = decodeURIComponent(routeProjectName);

  const userIsOwner = useSelector((state: any) =>
    isEditor ? state.editor.userIsOwner : false
  );
  const isLoading = useSelector((state: any) =>
    isEditor ? state.editor.isLoading : false
  );

  const projectName = useSelector((state: any) =>
    isEditor ? state.editor.projectName : ""
  );

  const saveAllFiles = () => {
    window.dispatchEvent(new CustomEvent("saveAllFiles"));
  };
  const formatAndSaveAllFiles = () => {
    window.dispatchEvent(new CustomEvent("formatAndSaveAllFiles"));
  };
  const forkProject = () => {
    window.location.href = `/c/${routeProjectName}`;
  };
  return (
    <Group
      gap="xs"
      px="md"
      py="xs"
      style={{
        borderBottom:
          theColorScheme === "dark" ? "1px solid #333" : "1px solid #eee",
        background: theColorScheme === "dark" ? "#181A1B" : "#fafafa",
        color: theColorScheme === "dark" ? "#fff" : undefined,
        minHeight: 48,
        zIndex: 100,
        position: "relative"
      }}
    >
      <ActionIcon
        component={Link}
        to="/"
        size="xs"
        variant="subtle"
        style={{
          color: theColorScheme === "dark" ? "#fff" : undefined,
          width: 25,
          height: 25,
          margin: "0 0 0 0"
        }}
      >
        <PiHouseBold />
      </ActionIcon>
      {isEditor && (
        <Menu withinPortal position="bottom-start" shadow="md">
          <Menu.Target>
            <Text
              fw={700}
              c={theColorScheme === "dark" ? "#fff" : undefined}
              style={{
                cursor: userIsOwner ? "pointer" : "default",
                paddingRight: 4,
                paddingLeft: 4,
                display: "inline-flex",
                alignItems: "center"
              }}
            >
              {projectName || "HyTOP"}
            </Text>
          </Menu.Target>
        </Menu>
      )}
      {!isEditor && (
        <Text fw={700} c={theColorScheme === "dark" ? "#fff" : undefined}>
          HyTOP
        </Text>
      )}
      {isEditor && (
        <>
          <Group gap={0}>
            {userIsOwner && (
              <Tooltip label="Save All">
                <ActionIcon
                  onClick={saveAllFiles}
                  color={primaryColor}
                  size="md"
                  style={{
                    color: theColorScheme === "dark" ? "#fff" : undefined
                  }}
                >
                  <PiFloppyDiskBold />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
          <Group gap={0}>
            {userIsOwner ? (
              <Tooltip label="Format with Prettier and Save All">
                <ActionIcon
                  onClick={formatAndSaveAllFiles}
                  color={primaryColor}
                  size="md"
                  style={{
                    color: theColorScheme === "dark" ? "#fff" : undefined
                  }}
                >
                  <PiMagicWandBold />
                </ActionIcon>
              </Tooltip>
            ) : null}
          </Group>
          <Tooltip label="Fork Project">
            <ActionIcon
              onClick={forkProject}
              color="green"
              variant="light"
              size="md"
              style={{
                color: theColorScheme === "dark" ? "#fff" : undefined
              }}
            >
              <PiGitForkBold />
            </ActionIcon>
          </Tooltip>
        </>
      )}
      <Group gap={0} ml="auto">
        {userInfo ? (
          <Button
            component={Link}
            to="/profile"
            size="xs"
            variant="subtle"
            style={{
              color: theColorScheme === "dark" ? "#fff" : undefined
            }}
          >
            {userInfo.name}
          </Button>
        ) : (
          <Button
            component={Link}
            to="/login"
            size="xs"
            variant="subtle"
            style={{
              color: theColorScheme === "dark" ? "#fff" : undefined
            }}
          >
            Sign In
          </Button>
        )}
      </Group>
      {isEditor && isLoading && <Loader size="sm" />}
    </Group>
  );
};

export default Header;
