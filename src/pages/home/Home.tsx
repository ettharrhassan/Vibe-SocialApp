import axios from "axios";
import { useContext } from "react";
import { AuthCreatedContext } from "../../context/AuthContext";
import type { PostType } from "../../types/Posts.types";
import PostCard from "../../components/post/PostCard";
import Loader from "../../components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import CreatePost from "../../components/createPost/CreatePost";

export default function Home() {
  const { token } = useContext(AuthCreatedContext);

  function getAllPosts() {
    return axios.get("https://route-posts.routemisr.com/posts", {
      headers: {
        token: token,
      },
    });
  }

  const { data, isLoading, isError } = useQuery({
    queryFn: getAllPosts,
    queryKey: ["allPosts"],
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <h1>error</h1>;
  }
  return (
    <>
<div className="min-h-screen bg-softRose p-4">
  <div className="mx-auto w-full max-w-2xl space-y-6">
    <CreatePost />

    {data?.data.data.posts.map((post: PostType) => (
      <PostCard post={post} key={post._id} />
    ))}
  </div>
</div>
    </>
  );
}
