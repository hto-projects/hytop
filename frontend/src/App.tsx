import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Main/Header";
import { useComputedColorScheme } from "@mantine/core";
import "./App.css";
import React, { useState, useEffect } from "react";
import { socket } from "./socket";
import { ConnectionState } from "./components/Socket/ConnectionState";
import { ConnectionManager } from "./components/Socket/ConnectionManager";
import { Events } from "./components/Socket/Events";
import { MyForm } from "./components/Socket/MyForm";

const App = () => {
  const theColorScheme = useComputedColorScheme("light");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents((previous) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onFooEvent);
    };
  }, []);

  return (
    <>
      <ToastContainer
        position="bottom-right"
        theme={theColorScheme === "dark" ? "dark" : "light"}
      />
      <Header />
      <div
        className="App"
        id="main-container"
        style={{
          height: "calc(100vh - 48px)", // ?
          overflow: "hidden",
          flex: 1
        }}
      >
        <ConnectionState isConnected={isConnected} />
        <Events events={fooEvents} />
        <ConnectionManager />
        <MyForm />

        <Outlet />
      </div>
    </>
  );
};

export default App;
