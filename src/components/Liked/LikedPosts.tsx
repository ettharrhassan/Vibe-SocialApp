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

  if (isLoading) return <p>Loading liked posts...</p>;

  if (isError) return <p>Couldn't load liked posts.</p>;

  return (
    <>
    <div className="min-h-screen bg-softRose p-2  ">
      <div className="w-full mx-auto max-w-2xl space-y-6">
        {likedPosts?.length ? (
          likedPosts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p>You haven't liked any posts yet.</p>
        )}
      </div>
      </div>
    </>
  );
}
