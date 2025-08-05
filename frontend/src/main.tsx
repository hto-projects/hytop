import "@mantine/core/styles.css";
import "mantine-contextmenu/styles.css";
import { createTheme, MantineProvider, ColorSchemeScript } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./store";
import { Provider, useSelector, useDispatch } from "react-redux";
import App from "./App";
import HomeScreen from "./screens/HomeScreen";
import PrivateRoute from "./components/PrivateRoute";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import CreateProjectScreen from "./screens/CreateProject";
import ProjectEditor from "./screens/ProjectEditor";
import CopyProjectScreen from "./screens/CopyProject";
import AboutScreen from "./screens/AboutScreen";
import { useEffect } from "react";
import { setMonacoTheme } from "./slices/editorSlice";
import { setColorScheme } from "./slices/themeSlice";
import { getCustomTheme, defaultTheme } from "./theme";
import { ContextMenuProvider } from "mantine-contextmenu";
import AuthContainer from "./components/AuthContainer";
import "./fonts/comic-mono.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/create-project" element={<CreateProjectScreen />} />
      <Route path="/e/:projectName" element={<ProjectEditor />} />
      <Route path="/c/:projectName" element={<CopyProjectScreen />} />
      <Route path="/about" element={<AboutScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>
    </Route>
  )
);

const Root = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    const systemPrefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (!localStorage.getItem("color scheme")) {
      dispatch(setColorScheme(systemPrefersDark ? "dark" : "light"));
    }
    if (!localStorage.getItem("monacoTheme")) {
      dispatch(setMonacoTheme(systemPrefersDark ? "vs-dark" : "vs-light"));
    }
  }, [dispatch]);
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  const theme = primaryColor ? getCustomTheme(primaryColor) : defaultTheme;
  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <ContextMenuProvider>
          <React.StrictMode>
            <RouterProvider router={router} />
          </React.StrictMode>
        </ContextMenuProvider>
      </MantineProvider>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Root />
  </Provider>
);
