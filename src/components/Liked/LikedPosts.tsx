import { useContext } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { AuthCreatedContext } from "../../context/AuthContext";
import PostCard from "../../components/post/PostCard";
import type { PostCardPropsType } from "../../types/PostCardPropsType.types";

type PostType = PostCardPropsType["post"];

export default function LikedPosts() {
  const { token, userId } = useContext(AuthCreatedContext);
  const {
    data: likedPosts,
    isLoading,
    isError,
  } = useQuery<PostType[]>({
    queryKey: ["likedPosts"],
    enabled: Boolean(token && userId),
    queryFn: async () => {
      if (!userId) return [];

      const response = await axios.get(
        "https://route-posts.routemisr.com/posts",
        { headers: { token } },
      );

      const posts: PostType[] = response.data.data.posts;

      return posts.filter((post) => post.likes?.includes(userId));
    },
  });

  if (isLoading) return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-softRose p-2">
      <p className="text-center text-lg font-medium text-burgundy">Loading liked posts...</p>
    </main>
  );
  if (isError) return <p>Couldn't load liked posts.</p>;

  const hasLikedPosts = Boolean(likedPosts?.length);

  return (
    <main
      className={`min-h-[calc(100vh-4rem)] bg-softRose p-2 ${
        hasLikedPosts ? "" : "flex items-center justify-center"
      }`}
    >
      {hasLikedPosts ? (
        <div className="mx-auto w-full max-w-2xl space-y-6">
          {likedPosts?.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="w-full text-center text-lg font-medium text-burgundy">
          You haven't liked any posts yet.
        </p>
      )}
    </main>
  );
}