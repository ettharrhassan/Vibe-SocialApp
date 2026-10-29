import { useContext, useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Label, toast } from "@heroui/react";
import { AiFillLike } from "react-icons/ai";
import { FaFire, FaTrash } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdEdit } from "react-icons/md";
import { Hearts } from "react-loader-spinner";
import { AuthCreatedContext } from "../../context/AuthContext";
import type { CommentType } from "../../types/Posts.types";
import Reply from "../Reply/Reply";

type CommentProps = {
  comment: CommentType;
  postId: string;
  isTopComment?: boolean;
};

export default function Comment({
  comment,
  postId,
  isTopComment = false,
}: CommentProps) {
  const { userId, token } = useContext(AuthCreatedContext);
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isLiked, setIsLiked] = useState(() =>
    Boolean(
      userId &&
        comment.likes?.some((like) =>
          typeof like === "string" ? like === userId : like._id === userId,
        ),
    ),
  );
  const [likesCount, setLikesCount] = useState(comment.likes?.length ?? 0);

  const isOwner = userId === comment.commentCreator._id;

  useEffect(() => {
    setEditedContent(comment.content);
    setLikesCount(comment.likes?.length ?? 0);
    setIsLiked(
      Boolean(
        userId &&
          comment.likes?.some((like) =>
            typeof like === "string" ? like === userId : like._id === userId,
          ),
      ),
    );
  }, [comment.content, comment.likes, userId]);

  function refreshComments() {
    queryClient.invalidateQueries({
      queryKey: ["comments", postId],
    });
    queryClient.invalidateQueries({
      queryKey: ["allPosts"],
    });
  }

  const { isPending: isUpdating, mutate: mutateUpdateComment } = useMutation({
    mutationFn: (content: string) =>
      axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
        { content },
        { headers: { token } },
      ),
    onSuccess: () => {
      setIsEditing(false);
      toast.success("Comment Updated");
      refreshComments();
    },
    onError: () => {
      toast.danger("Could not update comment");
    },
  });

  const { isPending: isDeleting, mutate: mutateDeleteComment } = useMutation({
    mutationFn: () =>
      axios.delete(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
        { headers: { token } },
      ),
    onSuccess: () => {
      toast.success("Comment Deleted");
      refreshComments();
    },
    onError: () => {
      toast.danger("Could not delete comment");
    },
  });

  const { isPending: isLiking, mutate: mutateToggleLike } = useMutation({
    mutationFn: () =>
      axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/like`,
        {},
        { headers: { token } },
      ),
    onSuccess: () => {
      setIsLiked((previous) => !previous);
      setLikesCount((previous) => previous + (isLiked ? -1 : 1));
      refreshComments();
    },
    onError: () => {
      toast.danger("Could not like comment");
    },
  });

  function handleSaveEdit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = editedContent.trim();
    if (!content || content === comment.content || isUpdating) return;

    mutateUpdateComment(content);
  }

  return (
    <div className="my-3 rounded-2xl border border-lightPink bg-white p-4">
      {isTopComment && (
        <p className="mb-2 flex w-35 items-center justify-center gap-1 rounded-2xl border border-lightPink bg-linear-to-r from-lightPink to-softRose p-1 text-xs font-semibold text-burgundy">
          <FaFire />
          <span>Top Comment</span>
        </p>
      )}

      <div className="flex items-start gap-2">
        <img
          src={comment.commentCreator.photo}
          alt={`${comment.commentCreator.name}'s profile`}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />

        <div className="min-w-0 flex-1">
          <p className="font-medium">{comment.commentCreator.name}</p>

          {isEditing ? (
            <form
              onSubmit={handleSaveEdit}
              className="mt-2 flex flex-col gap-2"
            >
              <input
                value={editedContent}
                onChange={(event) => setEditedContent(event.target.value)}
                aria-label="Edit comment"
                className="w-full rounded-xl border border-lightPink p-2 outline-none focus:border-burgundy"
                autoFocus
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={
                    isUpdating ||
                    !editedContent.trim() ||
                    editedContent.trim() === comment.content
                  }
                  className="flex min-w-16 items-center justify-center rounded-lg bg-burgundy px-3 py-1 text-sm text-white disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Hearts
                      height="20"
                      width="40"
                      color="#fff7fe"
                      ariaLabel="hearts-loading"
                      visible
                    />
                  ) : (
                    "Save"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditedContent(comment.content);
                    setIsEditing(false);
                  }}
                  disabled={isUpdating}
                  className="rounded-lg border border-lightPink px-3 py-1 text-sm text-burgundy"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="wrap-break-word">{comment.content}</p>
          )}
        </div>

        {isOwner && !isEditing && (
          <Dropdown>
            <Dropdown.Trigger>
              <Button
                aria-label="Comment options"
                variant="secondary"
                className="size-9 min-w-9 rounded-full bg-transparent p-0 text-burgundy hover:bg-softRose"
              >
                <HiOutlineDotsHorizontal className="size-6" />
              </Button>
            </Dropdown.Trigger>

            <Dropdown.Popover placement="bottom end">
              <Dropdown.Menu
                onAction={(key) => {
                  if (key === "edit-comment") {
                    setEditedContent(comment.content);
                    setIsEditing(true);
                  }

                  if (key === "delete-comment") {
                    mutateDeleteComment();
                  }
                }}
              >
                <Dropdown.Item
                  id="edit-comment"
                  textValue="Edit Comment"
                  className="flex items-center justify-between gap-4 px-3 py-2"
                >
                  <Label className="text-burgundy">Edit Comment</Label>
                  <MdEdit className="size-5 text-burgundy" />
                </Dropdown.Item>

                <Dropdown.Item
                  id="delete-comment"
                  textValue="Delete Comment"
                  variant="danger"
                  isDisabled={isDeleting}
                  className="flex items-center justify-between gap-4 px-3 py-2"
                >
                  <Label className="text-burgundy">Delete Comment</Label>
                  <FaTrash className="size-4 text-burgundy" />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        )}
      </div>

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={() => mutateToggleLike()}
          disabled={isLiking}
          aria-label={isLiked ? "Unlike comment" : "Like comment"}
          className={`flex items-center gap-1 disabled:opacity-60 ${
            isLiked ? "text-burgundy" : "text-softRose"
          }`}
        >
          <AiFillLike />
          {likesCount > 0 && <span className="text-sm">{likesCount}</span>}
        </button>
      </div>

      <Reply
        postId={postId}
        parentCommentId={comment._id}
        repliesCount={comment.repliesCount}
      />
    </div>
  );
}
