import { createContext, useState } from "react";
import type {
  AuthContextType,
  AuthContextPropsType,
  AuthUserType,
} from "../types/AuthContext.types";

export const AuthCreatedContext = createContext<AuthContextType>({
  token: null,
  user: null,
  addDataToToken() {},
  removeToken() {},
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

  function addDataToToken(tkn: string, userData: AuthUserType) {
    setToken(tkn);
    setUser(userData);

    localStorage.setItem("token", tkn);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function removeToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  }

  return (
    <AuthCreatedContext.Provider
      value={{ token, user, addDataToToken, removeToken }}>
      {props.children}
    </AuthCreatedContext.Provider>
  );
}
