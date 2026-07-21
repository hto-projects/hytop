import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoginForm from "../LandingPage/LoginForm";
import Splash from "../LandingPage/Splash";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: any) => state.auth);

  return (
    <ScrollArea h={1000} w="100vw">
      <Splash />
      <LoginForm />
    </ScrollArea>
  );
};

export default HomeScreen;
