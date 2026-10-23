import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios, { type AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Hearts } from "react-loader-spinner";
import {  Spinner, toast } from "@heroui/react";
import { AiFillLike } from "react-icons/ai";
import { CiShare2 } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import type { PostCardPropsType } from "../../types/PostCardPropsType.types";
import { AuthCreatedContext } from "../../context/AuthContext";
import Comment from "../comment/Comment";
import DropDown from "../DropDown/DropDown";

export default function PostCard({ post, allComment }: PostCardPropsType) {
  const [commentInput, setCommentInput] = useState("");
  const [isPostExpanded, setIsPostExpanded] = useState(false);
  const queryClient = useQueryClient();
  const { userId, token } = useContext(AuthCreatedContext);

  function sendComment() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${post._id}/comments`,
      { content: commentInput },
      {
        headers: {
          token,
        },
      },
    );
  }

  function deletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`, {
      headers: { token },
    });
  }

  const { isPending: isDeleting, mutate: mutateDeletePost } = useMutation<
    AxiosResponse,
    Error,
    void
  >({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post Deleted");
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
    onError: () => {
      toast.danger("Post error");
    },
  });

  const { isPending: isSendingComment, mutate: mutateComment } = useMutation({
    mutationFn: sendComment,
    onSuccess: () => {
      setCommentInput("");
      queryClient.invalidateQueries({ queryKey: ["comments", post._id] });
    },
  });

  return (
    <div
      className={`mx-auto my-4 w-full min-w-0 max-w-full rounded-2xl border border-lightPink bg-white/80 p-3 transition-opacity sm:p-4 ${
        isDeleting ? "opacity-35" : "opacity-100"
      }`}>
      <div className="flex justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <img
            src={post.user.photo}
            alt={`${post.user.name}'s profile`}
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />

          <div className="min-w-0">
            <p className="wrap-break-word font-medium">{post.user.name}</p>
            <Link
              to={`/post/${post._id}`}
              className="text-xs text-gray-500 sm:text-sm">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Link>
          </div>
        </div>

        {isDeleting ? (
          <Spinner />
        ) : (
          <DropDown
            isOwner={userId === post.user._id}
            onDelete={() => mutateDeletePost()}
          />
        )}
      </div>

      <div className="my-4 flex min-w-0 flex-col gap-3 sm:my-5">
        <div className="min-w-0">
          <p className="wrap-break-word">
            {!post.body
              ? ""
              : isPostExpanded || post.body.length <= 180
                ? post.body
                : `${post.body.slice(0, 180)}...`}
          </p>

          {(post.body?.length ?? 0) > 180 && (
            <button
              type="button"
              onClick={() => setIsPostExpanded(!isPostExpanded)}
              className="mt-1 font-semibold text-burgundy">
              {isPostExpanded ? "See less" : "See more"}
            </button>
          )}
        </div>

        {post.image && (
          <img
            src={post.image}
            alt={post.body || "Post image"}
            className="h-auto max-h-110 w-full rounded-2xl object-contain"
          />
        )}
      </div>

      <div className="my-3 flex flex-wrap gap-2 sm:gap-4">
        <button className="btnPost">
          <AiFillLike /> <span>Like</span>
        </button>

        <button
          className="btnPost"
          disabled={isSendingComment}
          onClick={() => mutateComment()}>
          {isSendingComment ? (
            <Hearts
              height="25"
              width="100"
              color="#fff7fe"
              ariaLabel="hearts-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          ) : (
            <>
              <FaRegComment /> <span>Comment</span>
            </>
          )}
        </button>

        <button className="btnPost">
          <CiShare2 /> <span>Share</span>
        </button>
      </div>

      {allComment?.length
        ? [...allComment]
            .sort((a, b) => {
              if (a._id === post.topComment?._id) return -1;
              if (b._id === post.topComment?._id) return 1;
              return 0;
            })
            .map((comment) => (
              <Comment
                comment={comment}
                key={comment._id}
                isTopComment={comment._id === post.topComment?._id}
              />
            ))
        : post.topComment && <Comment comment={post.topComment} isTopComment />}

      <input
        value={commentInput}
        type="text"
        onChange={(e) => setCommentInput(e.target.value)}
        placeholder="Enter Your Comment"
        className="w-full rounded-2xl border border-lightPink p-3 outline-none focus:border-2"
      />
    </div>
  );
}
