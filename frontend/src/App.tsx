import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";

const App = () => {
  const location = useLocation();
  // regex 🥰🥰🥰
  const match = location.pathname.match(/^\/([ec])\/([^/]+)$/);
  const projectName = match ? match[2] : "";

  return (
    <>
      <ToastContainer />
      <Header />
      <div id="main-container">
        <Outlet />
      </div>
    </>
  );
};

export default App;
