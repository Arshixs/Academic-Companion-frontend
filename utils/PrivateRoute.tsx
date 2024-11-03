import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext"; // Update the path as needed
import Cookies from "js-cookie";
import { access } from "fs";

function PrivateRoute({ element: Element }) {
  const { user } = useContext(AuthContext);
  const acces = Cookies.get("access_token") || null;

  return user ? (
    <Element />
  ) : acces ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/home" />
  );
}

export default PrivateRoute;
