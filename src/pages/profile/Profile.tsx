import { useContext, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, toast } from "@heroui/react";
import { FaCamera, FaRegFileAlt, FaShare } from "react-icons/fa";
import { AuthCreatedContext } from "../../context/AuthContext";
import type { AuthUserType } from "../../types/AuthContext.types";
import type { PostType } from "../../types/Posts.types";
import PostCard from "../../components/post/PostCard";
import CreatePost from "../../components/createPost/CreatePost";
import Loader from "../../components/Loader/Loader";
import { useFollowingData } from "../../components/Follow/useFollowingData";
import FollowingList from "../../components/Follow/FollowingList";
import coverImage from "../../assets/dd43c941-c0a9-4480-93ed-d521ff26b10a.png";

type ProfileTab = "posts" | "shares" | "following";

type ProfileUserWithCounts = AuthUserType & {
  followersCount?: number;
  followerCount?: number;
  followers?: number | { count?: number } | unknown[];
};

type ProfileResponse = {
  data?: {
    user?: ProfileUserWithCounts;
    profile?: ProfileUserWithCounts;
  };
};

type PostsResponse = {
  data?: {
    posts?: PostType[];
  };
};

export default function Profile() {
  const { token, userId, user: authUser, addDataToToken } = useContext(AuthCreatedContext);
  const queryClient = useQueryClient();
  const followingQuery = useFollowingData();
  const followingCount = followingQuery.data?.count;
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const profileQuery = useQuery({
    queryKey: ["myProfile"],
    queryFn: () =>
      axios.get<ProfileResponse>(
        "https://route-posts.routemisr.com/users/profile-data",
        { headers: { token } },
      ),
    enabled: Boolean(token),
  });

  const postsQuery = useQuery({
    queryKey: ["allPosts"],
    queryFn: () =>
      axios.get<PostsResponse>("https://route-posts.routemisr.com/posts", {
        headers: { token },
      }),
    enabled: Boolean(token),
  });

  const profilePayload = profileQuery.data?.data?.data as
    | (ProfileUserWithCounts & { user?: ProfileUserWithCounts; profile?: ProfileUserWithCounts })
    | undefined;
  const profile =
    profilePayload?.user ??
    profilePayload?.profile ??
    profilePayload ??
    authUser;
  const followerList = profile?.followers;
  const followersCount = profile?.followersCount ?? profile?.followerCount ?? (typeof followerList === "number" ? followerList : Array.isArray(followerList) ? followerList.length : followerList?.count) ?? followingQuery.data?.profile?.followersCount ?? followingQuery.data?.profile?.followerCount ?? null;

  const allPosts = postsQuery.data?.data?.data?.posts ?? [];
  const myPosts = allPosts.filter((post) => post.user?._id === userId);
  const regularPosts = myPosts.filter((post) => !post.isShare);
  const sharedPosts = myPosts.filter((post) => post.isShare || Boolean(post.sharedPost));
  const visiblePosts = activeTab === "posts" ? regularPosts : sharedPosts;

  const { isPending: isUploadingPhoto, mutate: uploadPhoto } = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("photo", file);

      return axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formData,
        { headers: { token } },
      );
    },
    onSuccess: async ({ data }) => {
      const responsePayload = data?.data?.data ?? data?.data ?? data;
      const responseUser =
        responsePayload?.user ?? responsePayload?.profile ?? responsePayload;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["myProfile"] }),
        queryClient.invalidateQueries({ queryKey: ["allPosts"] }),
      ]);

      const refreshedProfile = queryClient.getQueryData<any>(["myProfile"])
        ?.data?.data;
      const refreshedUser =
        refreshedProfile?.user ?? refreshedProfile?.profile ?? refreshedProfile;
      const updatedPhoto = responseUser?.photo ?? refreshedUser?.photo;

      if (token && authUser && updatedPhoto) {
        addDataToToken(token, { ...authUser, photo: updatedPhoto });
      }

      setPhotoPreview(null);
      setPendingPhoto(null);
      if (photoInputRef.current) photoInputRef.current.value = "";
      toast.success(data?.message ?? "Profile photo updated");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.danger(
          error.response?.data?.message ?? "Could not update profile photo",
        );
      } else {
        toast.danger("Could not update profile photo");
      }
    },
  });

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.danger("Please choose an image file");
      event.target.value = "";
      return;
    }

    setPhotoPreview(URL.createObjectURL(file));
    setPendingPhoto(file);
    event.target.value = "";
  }

  function cancelPhotoPreview() {
    setPhotoPreview(null);
    setPendingPhoto(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  if (profileQuery.isLoading || postsQuery.isLoading) {
    return <Loader />;
  }

  if (profileQuery.isError || postsQuery.isError) {
    return (
      <div className="min-h-screen bg-softRose p-6 text-center text-burgundy">
        Could not load your profile. Please refresh and try again.
      </div>
    );
  }

  const displayName = profile?.name ?? authUser?.name ?? "Your Profile";
  const username = profile?.username ?? authUser?.username;
  const photo = photoPreview ?? profile?.photo ?? authUser?.photo ?? "";

  return (
    <main className="min-h-screen bg-softRose p-3 sm:p-6">
      <section className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-lightPink bg-white shadow-sm">
        <div className="relative h-52 w-full overflow-hidden sm:h-72">
          <img
            src={coverImage}
            alt="Vibe profile cover"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative px-5 pb-6 sm:px-10">
          <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative size-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-softRose shadow sm:size-32">
                {photo ? (
                  <img
                    src={photo}
                    alt={`${displayName}'s profile`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl font-bold text-burgundy">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                {isUploadingPhoto && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-medium text-white">
                    Uploading...
                  </div>
                )}
              </div>

              <div className="pb-1">
                <h1 className="text-xl font-bold text-burgundy sm:text-2xl">
                  {displayName}
                </h1>
                {username && <p className="text-sm text-gray-500">@{username}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:items-end">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                aria-label="Choose a profile photo"
              />
              <Button
                type="button"
                onPress={() => photoInputRef.current?.click()}
                isDisabled={isUploadingPhoto}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-burgundy px-4 py-2 font-semibold text-white transition-colors hover:bg-primePink hover:text-softRose sm:w-auto focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              >
                <FaCamera />
                {photoPreview ? "Choose another photo" : "Change profile photo"}
              </Button>
              {photoPreview && (
                <div className="flex w-full gap-2 sm:w-auto">
                  <Button
                    type="button"
                    onPress={() => pendingPhoto && uploadPhoto(pendingPhoto)}
                    isDisabled={isUploadingPhoto || !pendingPhoto}
                    className="flex-1 rounded-xl bg-burgundy px-4 py-2 font-semibold text-white transition-colors hover:bg-primePink hover:text-softRose sm:flex-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                  >
                    {isUploadingPhoto ? "Uploading..." : "Save photo"}
                  </Button>
                  <Button
                    type="button"
                    onPress={cancelPhotoPreview}
                    isDisabled={isUploadingPhoto}
                    className="flex-1 rounded-xl border border-lightPink bg-softRose! px-4 py-2 font-semibold text-burgundy transition-colors hover:bg-primePink! hover:text-softRose sm:flex-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-lightPink pt-4 text-sm text-gray-600">
            <button type="button" onClick={() => { setActiveTab("posts"); document.getElementById("profile-content")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="flex items-baseline gap-1.5 hover:text-burgundy">
              <span className="font-semibold text-burgundy">{regularPosts.length}</span><span>Posts</span>
            </button>
            <button type="button" onClick={() => { setActiveTab("shares"); document.getElementById("profile-content")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="flex items-baseline gap-1.5 hover:text-burgundy">
              <span className="font-semibold text-burgundy">{sharedPosts.length}</span><span>Shares</span>
            </button>
            {followingCount != null && (
              <button type="button" onClick={() => { setActiveTab("following"); document.getElementById("profile-content")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="flex items-baseline gap-1.5 hover:text-burgundy">
                <span className="font-semibold text-burgundy">{followingCount}</span><span>Following</span>
              </button>
            )}
            {followersCount != null && (
              <p className="flex items-baseline gap-1.5">
                <span className="font-semibold text-burgundy">{followersCount}</span><span>Followers</span>
              </p>
            )}
          </div>
        </div>
      </section>

      <section id="profile-content" className="mx-auto mt-4 w-full max-w-5xl scroll-mt-24 space-y-4">
        <div className="[&>button]:mb-0!">
          <CreatePost />
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-lightPink bg-white p-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setActiveTab("posts")}
            className={`flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-3 text-[13px] font-semibold transition-colors sm:gap-2 sm:px-3 sm:text-base ${
              activeTab === "posts" ? "bg-burgundy text-white" : "text-burgundy hover:bg-softRose"
            }`}
          >
            <FaRegFileAlt /> My Posts ({regularPosts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("shares")}
            className={`flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-3 text-[13px] font-semibold transition-colors sm:gap-2 sm:px-3 sm:text-base ${
              activeTab === "shares" ? "bg-burgundy text-white" : "text-burgundy hover:bg-softRose"
            }`}
          >
            <FaShare /> Shared Posts ({sharedPosts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("following")}
            className={`col-span-2 sm:col-span-1 flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-3 text-[13px] font-semibold transition-colors sm:gap-2 sm:px-3 sm:text-base ${
              activeTab === "following" ? "bg-burgundy text-white" : "text-burgundy hover:bg-softRose"
            }`}
          >
            Following ({followingCount ?? 0})
          </button>
        </div>

        {activeTab === "following" ? (
          <div className="rounded-2xl border border-lightPink bg-white p-4">
            <FollowingList />
          </div>
        ) : visiblePosts.length > 0 ? (
          <div className="space-y-4">
            {visiblePosts.map((post) => (
              <PostCard post={post} key={post._id} className="max-w-none my-0!" />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-lightPink bg-white p-8 text-center text-gray-500">
            {activeTab === "posts"
              ? "You haven't posted anything yet."
              : "You haven't shared any posts yet."}
          </div>
        )}
      </section>
    </main>
  );
}
