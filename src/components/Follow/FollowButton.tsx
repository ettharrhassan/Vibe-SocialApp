import { useContext } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@heroui/react";
import { AuthCreatedContext } from "../../context/AuthContext";
import { getFollowingQueryKey, useFollowingData, type FollowUser, type FollowingSnapshot } from "./useFollowingData";

type FollowButtonProps = { user: FollowUser; compact?: boolean };
type FollowAction = "follow" | "unfollow";
const API_URL = "https://route-posts.routemisr.com";

export default function FollowButton({ user, compact = false }: FollowButtonProps) {
  const { token, userId } = useContext(AuthCreatedContext);
  const queryClient = useQueryClient();
  const followingKey = getFollowingQueryKey(token, userId);
  const { data: followingData, isLoading: followingLoading, isError: followingError } = useFollowingData();
  const isFollowing = followingData?.users.some((item) => item._id === user._id) ?? false;

  const followMutation = useMutation({
    mutationFn: (_action: FollowAction) =>
      axios.put(`${API_URL}/users/${user._id}/follow`, {}, { headers: { token } }),
    onMutate: async (action) => {
      await queryClient.cancelQueries({ queryKey: followingKey });
      const previous = queryClient.getQueryData<FollowingSnapshot>(followingKey);
      queryClient.setQueryData<FollowingSnapshot>(followingKey, (current) => {
        if (!current) return current;
        const users = action === "follow"
          ? current.users.some((item) => item._id === user._id) ? current.users : [...current.users, user]
          : current.users.filter((item) => item._id !== user._id);
        const count = current.count == null
          ? users.length
          : Math.max(0, current.count + (action === "follow" ? 1 : -1));
        return { ...current, users, count };
      });
      return { previous, action };
    },
    onError: (error, _action, context) => {
      if (context?.previous) queryClient.setQueryData(followingKey, context.previous);
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.danger(message ?? `Could not ${context?.action ?? "update"} this account`);
    },
    onSuccess: (_response, action) => {
      void queryClient.invalidateQueries({ queryKey: followingKey });
      void queryClient.invalidateQueries({ queryKey: ["followSuggestions", token] });
      void queryClient.invalidateQueries({ queryKey: ["searchAccountSuggestions", token] });
      void queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      void queryClient.invalidateQueries({ queryKey: ["userProfile", token, user._id] });
      toast.success(action === "follow" ? `Following ${user.name}` : `Unfollowed ${user.name}`);
    },
  });

  const isBusy = followingLoading || followingError || followMutation.isPending;
  const baseClass = `shrink-0 rounded-full text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${compact ? "px-3 py-1.5" : "px-4 py-2"}`;

  if (isFollowing) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <span className={`${baseClass} border border-lightPink bg-softRose text-burgundy`}>
          Following
        </span>
        <button
          type="button"
          disabled={isBusy || !token}
          onClick={() => followMutation.mutate("unfollow")}
          aria-label={`Unfollow ${user.name}`}
          className={`${baseClass} border border-lightPink text-burgundy hover:bg-softRose`}
        >
          {followMutation.isPending && followMutation.variables === "unfollow" ? "Unfollowing…" : "Unfollow"}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={isBusy || !token}
      onClick={() => followMutation.mutate("follow")}
      aria-label={`Follow ${user.name}`}
      className={`${baseClass} bg-burgundy text-white hover:bg-primePink`}
    >
      {followMutation.isPending && followMutation.variables === "follow" ? "Following…" : "+ Follow"}
    </button>
  );
}
