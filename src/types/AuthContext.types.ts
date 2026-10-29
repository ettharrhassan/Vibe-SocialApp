import type { ReactNode } from "react";

export interface AuthUserType {
  _id: string;
  name: string;
  username: string;
  email: string;
  photo?: string | null;
  cover?: string | null;
  followersCount?: number;
  followerCount?: number;
  followingCount?: number;

  followers?: number | unknown[] | { count?: number };
  following?: number | unknown[] | { count?: number };
}

export interface AuthContextType {
  token: string | null;
  user: AuthUserType | null;
  addDataToToken: (tkn: string, user: AuthUserType) => void;
  removeToken: () => void;
  userId: string | null;
}

export interface AuthContextPropsType {
  children: ReactNode;
}
