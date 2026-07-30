import { useNavigate, useLocation } from "react-router-dom";
import { ScrollArea } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoginScreen from "../LandingPage/LoginScreen";
import FeaturedProjects from "../LandingPage/FeaturedProjects";
import AboutScreen from "../LandingPage/AboutScreen";
import Splash from "../LandingPage/Splash";
import { useEffect } from "react";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: any) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace("#", ""));
      if (el) el.scrollIntoView();
    }
  }, [location]);
  return (
    <ScrollArea h={1000} w="100vw">
      <Splash />
      <LoginScreen />
      <FeaturedProjects />
      <AboutScreen />
    </ScrollArea>
  );
};

export default HomeScreen;
