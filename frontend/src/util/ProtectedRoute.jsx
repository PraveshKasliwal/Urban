import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const role = localStorage.getItem("role");

  if (role === "admin") {
    return element;
  } else {
    alert("Access Denied! You are not an Admin.");
    return <Navigate to="/" />; // Redirect to home if not admin
  }
};

export default ProtectedRoute;