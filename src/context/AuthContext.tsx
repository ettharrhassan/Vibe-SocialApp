import { createContext, useEffect, useState } from "react";
import type {
  AuthContextType,
  AuthContextPropsType,
  AuthUserType,
} from "../types/AuthContext.types";
import { jwtDecode } from "jwt-decode";

export const AuthCreatedContext = createContext<AuthContextType>({
  token: null,
  user: null,
  addDataToToken() {},
  removeToken() {},
  userId: null,
});

export default function AuthContext(props: AuthContextPropsType) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const [user, setUser] = useState<AuthUserType | null>(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) return null;

    try {
      return JSON.parse(savedUser) as AuthUserType;
    } catch {
      return null;
    }
  });

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setUserId(null);
      return;
    }
    try {
      const decoded = jwtDecode<{ user: string }>(token);
      setUserId(decoded.user);
    } catch {
      setUserId(null);
    }
  }, [token]);

  function addDataToToken(tkn: string, userData: AuthUserType) {
    setToken(tkn);
    setUser(userData);
    setUserId(userData._id)

    localStorage.setItem("token", tkn);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function removeToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setUserId(null)
  }

  return (
    <AuthCreatedContext.Provider
      value={{ token, user, addDataToToken, removeToken, userId }}>
      {props.children}
    </AuthCreatedContext.Provider>
  );
}
