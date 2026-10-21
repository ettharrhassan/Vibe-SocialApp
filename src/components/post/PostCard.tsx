import { AiFillLike } from "react-icons/ai";
import { CiShare2 } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import type { PostCardPropsType } from "../../types/PostCardPropsType.types";
import Comment from "../comment/Comment";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Hearts } from "react-loader-spinner";

export default function PostCard({ post, allComment }: PostCardPropsType) {
  const [commentInput, setCommentInput] = useState("");
  const queryClient = useQueryClient();
  const [isPostExpanded, setIsPostExpanded] = useState(false);

  function sendComment() {
    let commentData = {
      content: commentInput,
    };

    return axios.post(
      `https://route-posts.routemisr.com/posts/${post._id}/comments`,
      commentData,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      },
    );
  }

  const { isError, isPending, error, mutate } = useMutation({
    mutationFn: sendComment,
    onSuccess: function () {
      setCommentInput("");
      queryClient.invalidateQueries({ queryKey: ["comments", post._id] });
    },
    onError: function () {},
  });
  return (
    <>
      <div
        key={post._id}
       className="mx-auto my-4 w-full min-w-0 max-w-full rounded-2xl border border-lightPink bg-white/80 p-3 sm:p-4">
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
          <button className="btnPost" disabled={isPending} onClick={mutate}>
            {isPending ? (
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
          : post.topComment && (
              <Comment comment={post.topComment} isTopComment />
            )}

        <div>
          <input
            value={commentInput}
            type="text"
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Enter Your Comment"
            className="w-full outline-none rounded-2xl p-3 border border-lightPink focus:border-lightPink focus:border-2"
          />
        </div>
      </div>
    </>
  );
}
