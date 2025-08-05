import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import { useComputedColorScheme } from "@mantine/core";
import { useGetProjectQuery } from "./slices/projectsApiSlice";
import { useEffect, useState } from "react";

const App = () => {
  const theColorScheme = useComputedColorScheme("light");
  const location = useLocation();

  const match = location.pathname.match(/^\/([ec])\/([^/]+)$/);
  const isEditor = !!match;
  const projectName = match ? decodeURIComponent(match[2]) : undefined;
  const getProject = useGetProjectQuery(projectName);

  const [currentProjectName, setCurrentProjectName] = useState(
    projectName || ""
  );

  return (
    <>
      <ToastContainer
        position="bottom-right"
        theme={theColorScheme === "dark" ? "dark" : "light"}
      />
      <Header
        projectName={isEditor ? currentProjectName : undefined}
        getProject={getProject}
      />
      <div
        id="main-container"
        style={{
          height: "calc(100vh - 48px)", // ?
          overflow: "hidden",
          flex: 1
        }}
      >
        <Outlet />
      </div>
    </>
  );
};

export default App;
