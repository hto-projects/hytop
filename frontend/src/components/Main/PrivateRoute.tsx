import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { userInfo, userInfoIsLoading } = useSelector((state: any) => state.auth);
  if (userInfoIsLoading) return <div>Loading...</div>;

  return userInfo ? <Outlet /> : <a href="/#signin">Sign into HyTOP to view this page.</a>;
};
export default PrivateRoute;
