import { useContext } from "react";
import type { ReactNode } from "react";
import { AuthCreatedContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useContext(AuthCreatedContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
s