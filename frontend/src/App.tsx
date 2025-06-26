import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";

const App = () => {
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
