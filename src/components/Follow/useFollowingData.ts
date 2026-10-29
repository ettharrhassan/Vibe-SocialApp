import { useContext } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { AuthCreatedContext } from "../../context/AuthContext";

const API_URL = "https://route-posts.routemisr.com";

export type FollowUser = {
  _id: string;
  name: string;
  username?: string;
  photo?: string | null;
};

export type FollowingSnapshot = {
  profile: Record<string, any>;
  users: FollowUser[];
  count: number | null;
};

export function getFollowingQueryKey(token: string | null, userId: string | null) {
  return ["followingProfile", token, userId] as const;
}

export function normalizeFollowUser(value: any): FollowUser | null {
  if (!value) return null;
  if (typeof value === "string") return { _id: value, name: "" };

  const nested = value.user ?? value.followingUser ?? value.followedUser ?? value.following ?? value.followed;
  if (typeof nested === "string") return { _id: nested, name: value.name ?? "" };
  const person = nested && typeof nested === "object" ? nested : value;
  const id = person?._id ?? person?.id ?? person?.userId ?? person?.user?._id;
  if (!id) return null;

  return {
    _id: String(id),
    name: person.name ?? person.fullName ?? person.username ?? "User",
    username: person.username,
    photo: person.photo ?? person.avatar ?? person.profilePhoto ?? null,
  };
}

function extractFollowingSnapshot(responseData: any): FollowingSnapshot {
  const root = responseData?.data?.data ?? responseData?.data ?? responseData;
  const profile = root?.profile ?? root?.user ?? root?.account ?? root ?? {};
  const relationValues = [
    profile.following,
    profile.followingUsers,
    profile.followings,
    profile.followedUsers,
    profile.followingList,
  ];
  const relationListContainer = relationValues.find(
    (value) => Array.isArray(value) || Array.isArray(value?.users) || Array.isArray(value?.following) || Array.isArray(value?.items),
  );
  const relationList = Array.isArray(relationListContainer)
    ? relationListContainer
    : relationListContainer?.users ?? relationListContainer?.following ?? relationListContainer?.items;
  const users = Array.isArray(relationList)
    ? relationList.map(normalizeFollowUser).filter((user): user is FollowUser => Boolean(user))
    : [];
  const explicitCount =
    profile.followingCount ??
    profile.followingsCount ??
    profile.following_count ??
    (typeof profile.following === "number" ? profile.following : profile.following?.count);
  const countValue = explicitCount ?? (Array.isArray(relationList) ? users.length : null);

  return {
    profile,
    users,
    count: countValue != null && Number.isFinite(Number(countValue)) ? Number(countValue) : null,
  };
}

export function useFollowingData() {
  const { token, userId } = useContext(AuthCreatedContext);

  return useQuery<FollowingSnapshot>({
    queryKey: getFollowingQueryKey(token, userId),
    enabled: Boolean(token && userId),
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/users/${userId}/profile`,
        { headers: { token } },
      );
      return extractFollowingSnapshot(data);
    },
  });
}