import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { useContext } from "react";
import { AuthCreatedContext } from "../../context/AuthContext";
import PostCard from "../../components/post/PostCard";

export default function PostPage() {
  const { id } = useParams();

 const nav= useNavigate()

  const { token } = useContext(AuthCreatedContext);

  function getPost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        token: token,
      },
    });
  }

  const { data, isLoading, isError,refetch } = useQuery({
    queryKey: ["post", id],
    queryFn: getPost,
    gcTime: 1000 * 60,
  });

  function getPostComments() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
      headers: {
        token: token,
      },
    });
  }

  const {data:commentData,isLoading:commentLoading} = useQuery({
    queryKey: ["comments", id],
    queryFn: getPostComments,
  });
  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return nav("/home")
  }
  return (
    <>
      <PostCard allComment={commentData?.data.data.comments} post={data?.data.data.post} />
    </>
  );
}
