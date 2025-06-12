import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
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
import { Provider } from "react-redux";
import HomeScreen from "./screens/HomeScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import CreateProjectScreen from "./screens/CreateProject";
import ProjectEditor from "./screens/ProjectEditor";
import CopyProjectScreen from "./screens/CopyProject";

const theme = createTheme({
  primaryColor: "blueButCooler",
  colors: {
    blueButCooler: [
      "#eff0fb",
      "#dbdcf0",
      "#b2b6e3",
      "#888dd6",
      "#656bcc",
      "#4f55c6",
      "#434ac4",
      "#353cad",
      "#2e359b",
      "#191f5e"
    ]
  }
});

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

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <MantineProvider theme={theme}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </MantineProvider>
  </Provider>
);
