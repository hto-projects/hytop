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

import { useLoginMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state: any) => state.auth);

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
    <>
      <Box
        style={{
          backgroundColor: "#000000"
        }}
      >
        <svg
          id="visual"
          viewBox="0 0 900 600"
          width="100%"
          height="auto"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          version="1.1"
        >
          <path
            d="M0 349L21.5 351.3C43 353.7 86 358.3 128.8 348C171.7 337.7 214.3 312.3 257.2 313.8C300 315.3 343 343.7 385.8 361.2C428.7 378.7 471.3 385.3 514.2 383.7C557 382 600 372 642.8 357.5C685.7 343 728.3 324 771.2 326.5C814 329 857 353 878.5 365L900 377L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
            fill="#0c0b13"
          ></path>
          <path
            d="M0 390L21.5 392.5C43 395 86 400 128.8 398.8C171.7 397.7 214.3 390.3 257.2 394.5C300 398.7 343 414.3 385.8 425C428.7 435.7 471.3 441.3 514.2 431.7C557 422 600 397 642.8 398.7C685.7 400.3 728.3 428.7 771.2 439.5C814 450.3 857 443.7 878.5 440.3L900 437L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
            fill="#312e5f"
          ></path>
          <path
            d="M0 459L21.5 468.2C43 477.3 86 495.7 128.8 502.7C171.7 509.7 214.3 505.3 257.2 503.2C300 501 343 501 385.8 497C428.7 493 471.3 485 514.2 486.5C557 488 600 499 642.8 493.8C685.7 488.7 728.3 467.3 771.2 463.2C814 459 857 472 878.5 478.5L900 485L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
            fill="#5e50b4"
          ></path>
        </svg>
      </Box>
      <Box
        style={{
          backgroundColor: "#5e50b4",
          height: "200vh",
          width: "100%",
          overflowY: "auto",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: "50px",
          boxSizing: "border-box"
        }}
      >
        <Paper
          shadow="xl"
          p={30}
          radius="lg"
          withBorder
          style={{
            width: 440,
            color: "#fff",
            border: "1px solid #373A40",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            paddingTop: 35,
            paddingBottom: 35
          }}
        >
          <Text size="1.6rem" fw={700} ta="center" c="white" mb={25}>
            Sign In
          </Text>

          <form onSubmit={submitHandler}>
            <TextInput
              label="Username"
              placeholder="Enter your username"
              size="md"
              radius="md"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              required
              mb={20}
              styles={{
                label: {
                  color: "white",
                  fontSize: "14px"
                },
                input: {
                  backgroundColor: "#2c2e33",
                  color: "white",
                  fontSize: "14px",
                  height: "45px"
                }
              }}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              size="md"
              radius="md"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
              mb={25}
              styles={{
                label: {
                  color: "white",
                  fontSize: "14px"
                },
                input: {
                  backgroundColor: "#2c2e33",
                  color: "white",
                  fontSize: "14px",
                  height: "45px"
                }
              }}
            />

            <Button
              type="submit"
              size="md"
              radius="md"
              fullWidth
              loading={isLoading}
            >
              Sign In
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
};
export default LoginScreen;
