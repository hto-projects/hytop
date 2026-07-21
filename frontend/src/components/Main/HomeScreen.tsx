import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Text,
  TextInput,
  PasswordInput,
  Button,
  ScrollArea
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoginScreen from "./LoginScreen";

import Logo from "../Interface/Logo";

import { useLoginMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";

import "../LandingPage/background.css";
import { generateStars } from "../LandingPage/background";

const HomeScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state: any) => state.auth);

  useEffect(() => {
    generateStars();
  });

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await login({ username, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error || "Login failed");
    }
  };

  return (
    <ScrollArea h={1000} w="100vw">
      <span id="stars-close"></span>
      <span id="stars-mid"></span>
      <span id="stars-far"></span>
      <Box
        style={{
          height: "200vh",
          width: "100%",
          backgroundColor: "#000000",
          overflowY: "auto",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: "50px",
          boxSizing: "border-box"
        }}
      >
        <Box
          style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Logo svgPath="/logo.svg" height={300} />
        </Box>
      </Box>
      <LoginScreen />
    </ScrollArea>
  );
};

export default HomeScreen;
