import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthCreatedContext } from "../../context/AuthContext";
import PostCard from "../../components/post/PostCard";
import type { PostCardPropsType } from "../../types/PostCardPropsType.types";

export default function SavedPost() {
  const { token } = useContext(AuthCreatedContext);
  type PostType = PostCardPropsType["post"];
  const { data, isLoading, isError } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      const response = await axios.get(
        "https://route-posts.routemisr.com/posts",
        { headers: { token } },
      );

      const posts: PostType[] = response.data.data.posts;

      return posts.filter((post) => post.bookmarked);
    },
  });

  if (isLoading) return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-softRose p-2">
      <p className="text-center text-lg font-medium text-burgundy">Loading saved posts...</p>
    </main>
  );
  if (isError) return <p>Couldn't load saved posts.</p>;

  const hasSavedPosts = Boolean(data?.length);

  return (
    <main
      className={`min-h-[calc(100vh-4rem)] bg-softRose p-2 ${
        hasSavedPosts ? "" : "flex items-center justify-center"
      }`}
    >
      {hasSavedPosts ? (
        <div className="mx-auto w-full max-w-2xl space-y-6">
          {data?.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="w-full text-center text-lg font-medium text-burgundy">
          You haven't saved any posts yet.
        </p>
      )}
    </main>
  );
}