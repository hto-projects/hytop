import {
  ActionIcon,
  Group,
  Tooltip,
  Text,
  Loader,
  useComputedColorScheme,
  Button,
  Menu,
  TextInput,
  Box
} from "@mantine/core";
import { PiFloppyDiskBold, PiGitForkBold, PiHouseBold } from "react-icons/pi";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { IProject } from "../../../shared/types";
import { current } from "@reduxjs/toolkit";

const Header = (projectName, getProject) => {
  const location = useLocation();
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  const theColorScheme = useComputedColorScheme("light");
  const { userInfo } = useSelector((state: any) => state.auth);

  const match = location.pathname.match(/^\/([ec])\/([^/]+)$/);
  const isEditor = !!match;
  let routeProjectName = match ? match[2] : "";
  routeProjectName = decodeURIComponent(routeProjectName);

  const userIsOwner = useSelector((state: any) =>
    isEditor ? state.editor.userIsOwner : false
  );
  const isLoading = useSelector((state: any) =>
    isEditor ? state.editor.isLoading : false
  );

  const currentProjectName = useSelector((state: any) =>
    isEditor ? state.editor.currentProjectName : ""
  );

  const saveAllFiles = () => {
    window.dispatchEvent(new CustomEvent("saveAllFiles"));
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
              {currentProjectName || "HyTOP"}
              {userIsOwner}
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
        <Group gap={0}>
          {userIsOwner ? (
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
          ) : (
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
          )}
        </Group>
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
