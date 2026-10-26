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

  if (isLoading) return <p>Loading saved posts...</p>;
  if (isError) return <p>Couldn't load saved posts.</p>;

  return (
    <>
      <div className="min-h-screen bg-softRose p-2 ">
        <div className="w-full mx-auto max-w-2xl space-y-6">
          {data?.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}
