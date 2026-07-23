import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Main/Header";
import { useComputedColorScheme } from "@mantine/core";
import "./App.css";
import { socket } from "./socket";
import { useEffect } from "react";

const App = () => {
  const theColorScheme = useComputedColorScheme("light");

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
