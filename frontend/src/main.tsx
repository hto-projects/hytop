import "@mantine/core/styles.css";
import { createTheme, MantineProvider, ColorSchemeScript } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./store.js";
import { Provider, useSelector, useDispatch } from "react-redux";
import HomeScreen from "./screens/HomeScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import CreateProjectScreen from "./screens/CreateProject";
import ProjectEditor from "./screens/ProjectEditor";
import CopyProjectScreen from "./screens/CopyProject";
import { getCustomTheme, defaultTheme } from "./theme";
import { useEffect } from "react";
import { setMonacoTheme } from "./slices/editorSlice";
import { setColorScheme } from "./slices/themeSlice";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/create-project" element={<CreateProjectScreen />} />
      <Route path="/e/:projectName" element={<ProjectEditor />} />
      <Route path="/c/:projectName" element={<CopyProjectScreen />} />
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
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>
      </MantineProvider>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Root />
  </Provider>
);
