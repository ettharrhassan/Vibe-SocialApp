import { useContext } from "react";
import { AuthCreatedContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  let { token } = useContext(AuthCreatedContext);

  if (!token) {
    return <Navigate to={"/login"} />;
  }

  return <>{children}</>;
}
