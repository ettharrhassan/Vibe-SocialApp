import { useContext } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { AuthCreatedContext } from "../../context/AuthContext";
import type { PostType } from "../../types/Posts.types";
import PostCard from "../../components/post/PostCard";
import FollowButton from "../../components/Follow/FollowButton";
import type { FollowUser } from "../../components/Follow/useFollowingData";
import Loader from "../../components/Loader/Loader";
import coverImage from "../../assets/dd43c941-c0a9-4480-93ed-d521ff26b10a.png";

const API_URL = "https://route-posts.routemisr.com";

function getProfile(payload: any): any {
  const data = payload?.data?.data ?? payload?.data ?? payload;
  return data?.profile ?? data?.user ?? data?.account ?? data;
}

function getPosts(payload: any): PostType[] {
  const data = payload?.data?.data ?? payload?.data ?? payload;
  const posts = data?.posts ?? data?.userPosts ?? data;
  return Array.isArray(posts) ? posts : [];
}

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const { token, userId } = useContext(AuthCreatedContext);
  const isOwnProfile = Boolean(id && id === userId);

  const profileQuery = useQuery({
    queryKey: ["userProfile", token, id],
    enabled: Boolean(token && id && !isOwnProfile),
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/users/${id}/profile`, {
        headers: { token },
      });
      return getProfile(data);
    },
  });

  const postsQuery = useQuery({
    queryKey: ["userPosts", token, id],
    enabled: Boolean(token && id && !isOwnProfile),
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/users/${id}/posts`, {
        headers: { token },
      });
      return getPosts(data);
    },
  });

  if (isOwnProfile) return <Navigate to="/profile" replace />;
  if (profileQuery.isLoading || postsQuery.isLoading) return <Loader />;
  if (profileQuery.isError || postsQuery.isError) {
    return (
      <main className="min-h-screen bg-softRose p-6 text-center text-burgundy">
        Could not load this profile.
      </main>
    );
  }

  const profile = profileQuery.data;
  const profileUser: FollowUser = {
    _id: profile?._id ?? profile?.id ?? id ?? "",
    name: profile?.name ?? profile?.username ?? "User",
    username: profile?.username,
    photo: profile?.photo ?? null,
  };
  const posts = postsQuery.data ?? [];

  return (
    <main className="min-h-screen bg-softRose p-3 sm:p-6">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-lightPink bg-white shadow-sm">
        <div className="h-40 w-full overflow-hidden sm:h-56">
          <img src={coverImage} alt="Profile cover" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <img
              src={profileUser.photo || "https://i.pravatar.cc/100?img=12"}
              alt=""
              className="size-20 shrink-0 rounded-full border-4 border-white object-cover shadow sm:size-24"
            />
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-burgundy sm:text-2xl">{profileUser.name}</h1>
              {profileUser.username && <p className="text-sm text-gray-500">@{profileUser.username}</p>}
            </div>
          </div>
          <FollowButton user={profileUser} />
        </div>
        <div className="flex flex-wrap gap-5 border-t border-lightPink px-5 py-4 text-sm text-gray-600 sm:px-8">
          <p><span className="font-semibold text-burgundy">{profile?.postsCount ?? posts.length}</span> Posts</p>
          {profile?.followingCount != null && (
            <p><span className="font-semibold text-burgundy">{profile.followingCount}</span> Following</p>
          )}
          {profile?.followersCount != null && (
            <p><span className="font-semibold text-burgundy">{profile.followersCount}</span> Followers</p>
          )}
        </div>
      </section>

      <section className="mx-auto mt-5 w-full max-w-5xl space-y-4">
        {posts.length ? (
          posts.map((post) => <PostCard key={post._id} post={post} className="max-w-none my-0!" />)
        ) : (
          <div className="rounded-2xl border border-lightPink bg-white p-8 text-center text-gray-500">
            This account hasn't posted anything yet.
          </div>
        )}
      </section>
    </main>
  );
}