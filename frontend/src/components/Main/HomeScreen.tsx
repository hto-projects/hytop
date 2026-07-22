import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoginScreen from "../LandingPage/LoginScreen";
import AboutScreen from "../LandingPage/AboutScreen";
import Splash from "../LandingPage/Splash";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: any) => state.auth);

  return (
    <ScrollArea h={1000} w="100vw">
      <Splash />
      <LoginScreen />
      <AboutScreen />
    </ScrollArea>
  );
};

export default HomeScreen;
