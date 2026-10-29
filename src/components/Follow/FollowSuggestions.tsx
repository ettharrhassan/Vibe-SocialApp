import { useContext } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AuthCreatedContext } from "../../context/AuthContext";
import FollowButton from "./FollowButton";
import { normalizeFollowUser, useFollowingData, type FollowUser } from "./useFollowingData";

const API_URL = "https://route-posts.routemisr.com";

export default function FollowSuggestions() {
  const { token, userId } = useContext(AuthCreatedContext);
  const followingQuery = useFollowingData();
  const suggestionsQuery = useQuery<FollowUser[]>({
    queryKey: ["followSuggestions", token],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/users/suggestions?limit=10`, {
        headers: { token },
      });
      const result =
        data?.data?.users ?? data?.data?.suggestions ?? data?.data?.suggestedUsers ??
        data?.users ?? data?.suggestions ?? data?.suggestedUsers ?? [];
      return Array.isArray(result)
        ? result.map(normalizeFollowUser).filter((user): user is FollowUser => Boolean(user))
        : [];
    },
  });

  if (suggestionsQuery.isLoading || followingQuery.isLoading) {
    return <p className="text-sm text-gray-500">Loading suggestions…</p>;
  }
  if (suggestionsQuery.isError || followingQuery.isError) {
    return <p className="text-sm text-gray-500">Could not load suggestions.</p>;
  }

  const followingIds = new Set(followingQuery.data?.users.map((user) => user._id) ?? []);
  const suggestions = (suggestionsQuery.data ?? []).filter(
    (user) => user._id !== userId && !followingIds.has(user._id),
  );

  return (
    <section className="rounded-2xl border border-lightPink bg-white p-4">
      <h2 className="mb-3 font-bold text-burgundy">Follow Suggestions</h2>
      {suggestions.length === 0 ? (
        <p className="text-sm text-gray-500">No new accounts to follow.</p>
      ) : (
        <div className="space-y-3">
          {suggestions.map((user) => (
            <div key={user._id} className="flex min-w-0 items-center gap-2">
              <Link to={`/profile/${user._id}`} className="flex min-w-0 flex-1 items-center gap-2">
                <img src={user.photo || "https://i.pravatar.cc/100?img=12"} alt="" className="size-9 shrink-0 rounded-full object-cover" />
                <span className="min-w-0 truncate text-sm font-medium text-burgundy">{user.name}</span>
              </Link>
              <FollowButton user={user} compact />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}