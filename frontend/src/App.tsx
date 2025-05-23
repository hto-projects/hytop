import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";

const App = () => {
  return (
    <>
      <ToastContainer />
      <div id="main-container">
        <Outlet />
      </div>
    </>
  );
};

export default App;
