import "@mantine/core/styles.css";
import "mantine-contextmenu/styles.css";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
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
import HomeScreen from "./components/Main/HomeScreen";
import PrivateRoute from "./components/Main/PrivateRoute";
import ProfileScreen from "./components/User/ProfileScreen";
import LoginScreen from "./components/User/LoginScreen";
import RegisterScreen from "./components/User/RegisterScreen";
import CreateProjectScreen from "./components/Main/CreateProjectScreen";
import ProjectViewScreen from "./components/ProjectView/ProjectViewScreen";
import CopyProjectScreen from "./components/Main/CopyProjectScreen";
import AboutScreen from "./components/Main/AboutScreen";
import LatestUpdatesScreen from "./components/Main/LatestUpdatesScreen";
import { setMonacoTheme } from "./slices/editorSlice";
import { setColorScheme } from "./slices/themeSlice";
import { getCustomTheme, defaultTheme } from "./theme";
import { ContextMenuProvider } from "mantine-contextmenu";
import "./assets/fonts/comic-mono.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/create-project" element={<CreateProjectScreen />} />
      <Route path="/e/:projectName" element={<ProjectViewScreen />} />
      <Route path="/c/:projectName" element={<CopyProjectScreen />} />
      <Route path="/about" element={<AboutScreen />} />
      <Route path="/latest-updates" element={<LatestUpdatesScreen />} />
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
