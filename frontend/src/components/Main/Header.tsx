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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ANON_USERNAME } from "../../../../shared/constants";
import { AuthView } from "../LandingPage/AuthPanel";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  const theColorScheme = "dark";
  const { userInfo } = useSelector((state: any) => state.auth);
  const userIsAdmin = userInfo?.admin || false;

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
  const projectOwnerUsername = useSelector((state: any) =>
    isEditor ? state.editor.projectOwnerUsername : ""
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

  let userLink;
  let headingComponent;

  if (projectOwnerUsername && projectOwnerUsername !== ANON_USERNAME) {
    userLink = <Link style={{ color: "unset", fontWeight: "thin" }} to={`/vp/${projectOwnerUsername}`}>{projectOwnerUsername}</Link>;
  } else {
    userLink = <span>Guest</span>;
  }

  if (projectName) {
    headingComponent = <span>{projectName} <span style={{ fontSize: ".8em", fontWeight: "normal" }}>by {userLink}</span></span>;
  } else {
    headingComponent = <span>HyTOP</span>;
  }

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
        // minHeight: "0px",
        zIndex: 100,
        position: "relative"
      }}
    >
      <ActionIcon
        component={Link}
        to="/#splash"
        size="xs"
        variant="subtle"
        style={{
          color: theColorScheme === "dark" ? "#fff" : undefined,
          width: "25px",
          height: "25px",
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
              {headingComponent}
            </Text>
          </Menu.Target>
        </Menu>
      )}
      {!isEditor && (
        <Text fw={700} c={theColorScheme === "dark" ? "#fff" : undefined}>
          HyTOP
        </Text>
      )}

      <Group
        gap="xs"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)"
        }}
      >

        {!userInfo && <Link to={`/#${AuthView.Register}`}>
          <Button
            size="xs"
            variant="subtle"
            style={{
              color: theColorScheme === "dark" ? "#fff" : undefined
            }}
          >
            Register
          </Button>
        </Link>}

        <Link to="/#featuredprojects">
          <Button
            size="xs"
            variant="subtle"
            style={{
              color: theColorScheme === "dark" ? "#fff" : undefined
            }}
          >
            Featured Projects
          </Button>
        </Link>

        <Link to="/#about">
          <Button
            size="xs"
            variant="subtle"
            style={{
              color: theColorScheme === "dark" ? "#fff" : undefined
            }}
          >
            About
          </Button>
        </Link>

        <Link to="/create-project">
          <Button
            size="xs"
            variant="subtle"
            style={{
              color: theColorScheme === "dark" ? "#fff" : undefined
            }}
          >
            Create Project
          </Button>

        </Link>

        {userIsAdmin && (
          <Button
            size="xs"
            variant="subtle"
            onClick={() => {
              navigate("/admin");
            }}
            style={{
              color: theColorScheme === "dark" ? "#fff" : undefined
            }}
          >
            Admin Panel
          </Button>
        )}
      </Group>

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
          <Link to={`/#${AuthView.SignIn}`}>
            <Button
              size="xs"
              variant="subtle"
              style={{
                color: theColorScheme === "dark" ? "#fff" : undefined
              }}
            >
              Sign In
            </Button></Link>
        )}
      </Group>
      {isEditor && isLoading && <Loader size="sm" />}
    </Group>
  );
};

export default Header;
