import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCredentials, logout } from "./slices/authSlice";
import { useGetUserInfoQuery } from "./slices/usersApiSlice";
import Header from "./components/Main/Header";
import { useComputedColorScheme } from "@mantine/core";
import "./App.css";
import { socket } from "./socket";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const App = () => {
  const theColorScheme = useComputedColorScheme("dark");
  const dispatch = useDispatch();

  const {
    data: userInfo,
    error: userInfoError
  } = useGetUserInfoQuery(null);

  useEffect(() => {
    if (userInfoError) {
      dispatch(logout(null));
    } else if (userInfo) {
      dispatch(setCredentials(userInfo));
    }
  }, [userInfo, userInfoError])

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    }
  }, []);

  return (
    <>
      <ToastContainer
        position="bottom-right"
        theme={theColorScheme === "dark" ? "dark" : "light"}
      />
      <Header />
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
