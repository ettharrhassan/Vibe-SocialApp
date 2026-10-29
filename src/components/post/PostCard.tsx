import { useContext, useRef, useState } from "react";
import type { SubmitEvent } from "react";
import { Link } from "react-router-dom";
import axios, { type AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export default function PostCard({ post, allComment, className }: PostCardPropsType) {
  const { userId, token } = useContext(AuthCreatedContext);
  const isSharedPost = Boolean(post.isShare || post.sharedPost);
  const sharedPostId =
    typeof post.sharedPost === "string"
      ? post.sharedPost
      : post.sharedPost?._id ??
        (typeof post.sharedPost?.post === "string"
          ? post.sharedPost.post
          : post.sharedPost?.post?._id) ??
        post.sharedPost?.originalPost?._id;
  const sharedContent = (typeof post.sharedPost === "object" && post.sharedPost ? post.sharedPost : undefined) as
    | (PostCardPropsType["post"] & {
        post?: PostCardPropsType["post"] | string;
        originalPost?: PostCardPropsType["post"];
      })
    | null
    | undefined;
  const embeddedPost =
    (typeof sharedContent?.post === "object" ? sharedContent.post : undefined) ??
    sharedContent?.originalPost ??
    sharedContent ??
    undefined;
  const hasEmbeddedContent = Boolean(
    embeddedPost?.body || embeddedPost?.image || embeddedPost?.user?.name,
  );
  const sharedPostQuery = useQuery({
    queryKey: ["sharedPost", sharedPostId],
    queryFn: () =>
      axios.get<{ data: { post: PostCardPropsType["post"] } }>(
        `https://route-posts.routemisr.com/posts/${sharedPostId}`,
        { headers: { token } },
      ),
    enabled: Boolean(isSharedPost && !hasEmbeddedContent && sharedPostId),
  });
  const contentPost =
    sharedPostQuery.data?.data?.data?.post ?? embeddedPost ?? post;

  const [commentInput, setCommentInput] = useState("");
  const [isPostExpanded, setIsPostExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(contentPost.bookmarked);
  const [isLiked, setIsLiked] = useState(false);

  const commentInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const likedByCurrentUser = Boolean(userId && contentPost.likes?.includes(userId));

  function sendComment() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${contentPost._id}/comments`,
      { content: commentInput.trim() },
      { headers: { token } },
    );
  }

  function deletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`, {
      headers: { token },
    });
  }

  function toggleSave() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${contentPost._id}/bookmark`,
      {},
      { headers: { token } },
    );
  }

  function toggleLike() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${contentPost._id}/like`,
      {},
      { headers: { token } },
    );
  }

  function sharePost() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${contentPost._id}/share`,
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
        queryKey: ["comments", contentPost._id],
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

  const { isPending: isSharing, mutate: mutateSharePost } = useMutation({
    mutationFn: sharePost,
    onSuccess: () => {
      toast.success("Post shared");
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.danger(error.response?.data?.message ?? "Could not share post");
      } else {
        toast.danger("Could not share post");
      }
    },
  });

  function handleSendComment() {
    if (!commentInput.trim() || isSendingComment) return;
    mutateComment();
  }

  function handleCommentAction() {
    if (isSendingComment) return;

    if (commentInput.trim()) {
      handleSendComment();
    } else {
      commentInputRef.current?.focus();
    }
  }

  function submitComment(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    handleSendComment();
  }

  const isPostLiked = isLiked || likedByCurrentUser;
  const likesCount = contentPost.likesCount ?? contentPost.likes?.length ?? 0;
  const commentsCount = contentPost.commentsCount ?? 0;
  const sharesCount = contentPost.sharesCount ?? 0;

  return (
    <div
      className={`mx-auto my-4 w-full min-w-0 ${className ?? "max-w-2xl"} rounded-2xl border border-lightPink bg-white/80 p-3 transition-opacity sm:p-4 ${
        isDeleting ? "opacity-35" : "opacity-100"
      }`}
    >
      <div className="flex justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <img
            src={post.user.photo}
            alt={`${post.user.name}'s profile`}
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />

          <div className="min-w-0">
            <p className="wrap-break-word font-medium">{post.user.name}</p>
            {isSharedPost && (
              <p className="text-xs text-gray-500">Shared a post</p>
            )}

            <Link
              to={`/post/${contentPost._id}`}
              className="text-xs text-gray-500 sm:text-sm"
            >
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
            isShared={isSharedPost}
            onDelete={() => mutateDeletePost()}
            onSave={() => mutateToggleSave()}
            isSaved={isSaved}
          />
        )}
      </div>

      <div className={`my-4 flex min-w-0 flex-col gap-3 sm:my-5 ${isSharedPost ? "rounded-2xl border border-lightPink p-3 sm:p-4" : ""}`}>
        {isSharedPost && (
          <div className="flex min-w-0 items-center gap-2 border-b border-lightPink pb-3">
            <img
              src={contentPost.user?.photo}
              alt={`${contentPost.user?.name ?? "Original author"}'s profile`}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="wrap-break-word text-sm font-semibold">
                {contentPost.user?.name ?? "Original post"}
              </p>
              <p className="text-xs text-gray-500">Original post</p>
            </div>
          </div>
        )}

        <div className="min-w-0">
          <p className="wrap-break-word">
            {!contentPost.body
              ? ""
              : isPostExpanded || contentPost.body.length <= 180
                ? contentPost.body
                : `${contentPost.body.slice(0, 180)}...`}
          </p>

          {(contentPost.body?.length ?? 0) > 180 && (
            <button
              type="button"
              onClick={() => setIsPostExpanded((expanded) => !expanded)}
              className="mt-1 font-semibold text-burgundy"
            >
              {isPostExpanded ? "See less" : "See more"}
            </button>
          )}
        </div>

        {contentPost.image && (
          <img
            src={contentPost.image}
            alt={contentPost.body || "Post image"}
            className="h-auto max-h-110 w-full rounded-2xl object-contain"
          />
        )}
      </div>

      <div className="my-3 flex w-full flex-nowrap items-center gap-2 sm:gap-4">
        <button
          type="button"
          disabled={isLiking}
          onClick={() => mutateToggleLike()}
          aria-label={isLiking ? "Loading likes" : isPostLiked ? "Liked" : "Like"}
          className={`btnPost min-w-0 flex-1 justify-center gap-1 px-1 text-burgundy disabled:opacity-70 ${
            isPostLiked ? "bg-burgundy! text-softRose! border-0!" : ""
          }`}
        >
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
          disabled={isSendingComment}
          onClick={handleCommentAction}
          aria-label={isSendingComment ? "Sending comment" : "Comment"}
          className="btnPost min-w-0 flex-1 justify-center gap-1 px-1 text-burgundy disabled:opacity-70"
        >
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
          disabled={isSharing}
          onClick={() => mutateSharePost()}
          aria-label={isSharing ? "Sharing post" : "Share"}
          className="btnPost min-w-0 flex-1 justify-center gap-1 px-1 text-burgundy disabled:opacity-70"
        >
          {isSharing ? (
            <Hearts
              height="25"
              width="40"
              color="#8f1d65"
              ariaLabel="hearts-loading"
              visible
            />
          ) : (
            <>
              <CiShare2 className="shrink-0" />
              <span className={sharesCount > 0 ? "hidden sm:inline" : ""}>
                Share
              </span>
              {sharesCount > 0 && <span>{sharesCount}</span>}
            </>
          )}
        </button>
      </div>

      {allComment?.length
        ? [...allComment]
            .sort((a, b) => {
              if (a._id === contentPost.topComment?._id) return -1;
              if (b._id === contentPost.topComment?._id) return 1;
              return 0;
            })
            .map((comment) => (
              <Comment
                comment={comment}
                postId={contentPost._id}
                key={comment._id}
                isTopComment={comment._id === contentPost.topComment?._id}
              />
            ))
        : contentPost.topComment && (
            <Comment
              comment={contentPost.topComment}
              postId={contentPost._id}
              isTopComment
            />
          )}

      <form onSubmit={submitComment} className="relative mt-3">
        <input
          ref={commentInputRef}
          value={commentInput}
          type="text"
          onChange={(event) => setCommentInput(event.target.value)}
          placeholder="Enter Your Comment"
          className="w-full rounded-2xl border border-lightPink p-3 pr-12 outline-none focus:border-2"
        />

        <button
          type="submit"
          aria-label="Send comment"
          disabled={isSendingComment || !commentInput.trim()}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-burgundy transition-transform duration-300 hover:scale-[1.15] enabled:cursor-pointer disabled:cursor-not-allowed"
        >
          {isSendingComment ? (
            <Hearts
              height="20"
              width="32"
              color="#8f1d65"
              ariaLabel="hearts-loading"
              visible
            />
          ) : (
            <BsFillSendFill size={20} />
          )}
        </button>
      </form>
    </div>
  );
}
