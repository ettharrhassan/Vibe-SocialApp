import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios, { type AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Hearts } from "react-loader-spinner";
import { Spinner, toast } from "@heroui/react";
import { AiFillLike } from "react-icons/ai";
import { CiShare2 } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import { BsFillSendFill } from "react-icons/bs";

import type { PostCardPropsType } from "../../types/PostCardPropsType.types";
import { AuthCreatedContext } from "../../context/AuthContext";
import Comment from "../comment/Comment";
import DropDown from "../DropDown/DropDown";

export default function PostCard({ post, allComment }: PostCardPropsType) {
  const [commentInput, setCommentInput] = useState("");
  const [isPostExpanded, setIsPostExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(post.bookmarked);
  const [isLiked, setIsLiked] = useState(false);

  const queryClient = useQueryClient();
  const { userId, token } = useContext(AuthCreatedContext);

  // Set the initial like state from the current user's ID.
  const likedByCurrentUser = Boolean(userId && post.likes?.includes(userId));

  function sendComment() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${post._id}/comments`,
      { content: commentInput.trim() },
      {
        headers: { token },
      },
    );
  }

  function deletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`, {
      headers: { token },
    });
  }

  function toggleSave() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}/bookmark`,
      {},
      { headers: { token } },
    );
  }

  function toggleLike() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}/like`,
      {},
      { headers: { token } },
    );
  }

  const { mutate: mutateToggleSave } = useMutation({
    mutationFn: toggleSave,
    onSuccess: () => {
      setIsSaved((previous) => !previous);
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
  });

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
      queryClient.invalidateQueries({
        queryKey: ["comments", post._id],
      });
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
  });

  const { isPending: isLiking, mutate: mutateToggleLike } = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      setIsLiked((previous) => !previous);
      queryClient.invalidateQueries({ queryKey: ["likedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
  });

  function handleSendComment() {
    if (!commentInput.trim() || isSendingComment) return;
    mutateComment();
  }

  const isPostLiked = isLiked || likedByCurrentUser;
  const likesCount = post.likesCount ?? post.likes?.length ?? 0;
  const commentsCount = post.commentsCount ?? 0;
  const sharesCount = post.sharesCount ?? 0;

  return (
    <div
      className={`mx-auto my-4 w-full min-w-0 max-w-2xl rounded-2xl border border-lightPink bg-white/80 p-3 transition-opacity sm:p-4 ${
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
            post={post}
            isOwner={userId === post.user._id}
            onDelete={() => mutateDeletePost()}
            onSave={() => mutateToggleSave()}
            isSaved={isSaved}
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
              onClick={() => setIsPostExpanded((expanded) => !expanded)}
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

      <div className="my-3 flex w-full flex-nowrap items-center gap-2 sm:gap-4">
        <button
          type="button"
          disabled={isLiking}
          onClick={() => mutateToggleLike()}
          aria-label={
            isLiking ? "Loading likes" : isPostLiked ? "Liked" : "Like"
          }
          className={`btnPost min-w-0 flex-1 justify-center gap-1 px-1 disabled:opacity-70 ${
            isPostLiked ? "bg-burgundy! text-softRose! border-0!" : ""
          }`}>
          {isLiking ? (
            <Hearts
              height="25"
              width="40"
              color={isPostLiked ? "#fff7fe" : "#8f1d65"}
              ariaLabel="hearts-loading"
              visible
            />
          ) : (
            <>
              <AiFillLike className="shrink-0" />
              <span className={likesCount > 0 ? "hidden sm:inline" : ""}>
                {isPostLiked ? "Liked" : "Like"}
              </span>
              {likesCount > 0 && <span>{likesCount}</span>}
            </>
          )}
        </button>

        <button
          type="button"
          disabled={isSendingComment || !commentInput.trim()}
          onClick={handleSendComment}
          aria-label={isSendingComment ? "Loading comments" : "Send comment"}
          className="btnPost min-w-0 flex-1 justify-center gap-1 px-1 disabled:opacity-70">
          {isSendingComment ? (
            <Hearts
              height="25"
              width="40"
              color="#8f1d65"
              ariaLabel="hearts-loading"
              visible
            />
          ) : (
            <>
              <FaRegComment className="shrink-0" />
              <span className={commentsCount > 0 ? "hidden sm:inline" : ""}>
                Comment
              </span>
              {commentsCount > 0 && <span>{commentsCount}</span>}
            </>
          )}
        </button>

        <button
          type="button"
          aria-label="Share"
          className="btnPost min-w-0 flex-1 justify-center gap-1 px-1">
          <CiShare2 className="shrink-0" />
          <span className={sharesCount > 0 ? "hidden sm:inline" : ""}>
            Share
          </span>
          {sharesCount > 0 && <span>{sharesCount}</span>}
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
                postId={post._id}
                key={comment._id}
                isTopComment={comment._id === post.topComment?._id}
              />
            ))
        : post.topComment && (
            <Comment comment={post.topComment} postId={post._id} isTopComment />
          )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSendComment();
        }}
        className="relative mt-3">
        <input
          value={commentInput}
          type="text"
          onChange={(event) => setCommentInput(event.target.value)}
          placeholder="Enter Your Comment"
          className="w-full rounded-2xl border border-lightPink p-3 pr-12 outline-none focus:border-2 "
        />

        <button
          type="submit"
          aria-label="Send comment"
          disabled={isSendingComment || !commentInput.trim()}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-burgundy enabled:cursor-pointer disabled:cursor-not-allowed">
          <BsFillSendFill size={20} />
        </button>
      </form>
    </div>
  );
}
