import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext"; // Update the path as needed

function PrivateRoute({ element: Element }) {
  const { user } = useContext(AuthContext);

  return user ? <Element /> : <Navigate to="/login" />;
}

export default PrivateRoute;