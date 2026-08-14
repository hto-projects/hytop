import { useLocation } from "react-router-dom";
import AuthPanel, { AuthView } from "../LandingPage/AuthPanel";
import FeaturedProjects from "../LandingPage/FeaturedProjects";
import AboutScreen from "../LandingPage/AboutScreen";
import Splash from "../LandingPage/Splash";
import { useEffect, useState } from "react";

const HomeScreen = () => {
  const location = useLocation();
  const [elId, setElId] = useState<AuthView | "">("");

  useEffect(() => {
    if (location.hash) {
      const idFromUrl = location.hash.replace("#", "");
      if (idFromUrl) {
        if (idFromUrl === AuthView.Register || idFromUrl === AuthView.SignIn) {
          setElId(idFromUrl);
          const el = document.getElementById("auth");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }

          return;
        }
        
        const el = document.getElementById(idFromUrl);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [location]);
  return (
    /** 
     * there is a way to implement this with scroll area, but so far all the solutions we tried kept breaking the scroll
     * so this should work for now
     * Feel free to try implementing something that doesn't break!
     */
    <div
      style={{
        overflowY: "auto",
        overflowX: "hidden"
      }}
    >
      <Splash />
      <AuthPanel viewing={elId} />
      <FeaturedProjects />
      <AboutScreen />
    </div>
  );
};

export default HomeScreen;
