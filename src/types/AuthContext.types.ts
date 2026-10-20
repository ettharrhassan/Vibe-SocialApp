import type { ReactNode } from "react";

export interface AuthUserType {
  _id: string;
  name: string;
  username: string;
  email: string;
  photo?: string | null;
  cover?: string | null;
}

export interface AuthContextType {
  token: string | null;
  user: AuthUserType | null;
  addDataToToken: (tkn: string, user: AuthUserType) => void;
  removeToken: () => void;
}

export interface AuthContextPropsType {
  children: ReactNode;
}
