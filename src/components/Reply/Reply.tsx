import { useContext, useState } from "react";
import type { SubmitEvent } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@heroui/react";
import { Hearts } from "react-loader-spinner";
import { AuthCreatedContext } from "../../context/AuthContext";
import type { CommentType } from "../../types/Posts.types";

type ReplyProps = {
  postId: string;
  parentCommentId: string;
  repliesCount?: number;
};

type RepliesResponse = {
  data?: {
    replies?: CommentType[];
    comments?: CommentType[];
  };
};

export default function Reply({
  postId,
  parentCommentId,
  repliesCount = 0,
}: ReplyProps) {
  const { token } = useContext(AuthCreatedContext);
  const queryClient = useQueryClient();

  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [hasReplies, setHasReplies] = useState(repliesCount > 0);

  const {
    data: replies = [],
    isLoading,
    isError,
  } = useQuery<CommentType[]>({
    queryKey: ["replies", postId, parentCommentId],
    enabled: true,
    staleTime: 30_000,
    queryFn: async () => {
      const response = await axios.get<RepliesResponse>(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${parentCommentId}/replies?page=1&limit=10`,
        { headers: { token } },
      );

      return response.data.data?.replies ?? response.data.data?.comments ?? [];
    },
  });

  const { isPending: isSending, mutate: mutateSendReply } = useMutation({
    mutationFn: (content: string) =>
      axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${parentCommentId}/replies`,
        { content },
        { headers: { token } },
      ),
    onSuccess: () => {
      setReplyInput("");
      setHasReplies(true);
      setShowReplies(true);
      toast.success("Reply Added");

      queryClient.invalidateQueries({
        queryKey: ["replies", postId, parentCommentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["allPosts"],
      });
    },
    onError: () => {
      toast.danger("Could not send reply");
    },
  });

  function sendReply(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = replyInput.trim();
    if (!content || isSending) return;

    mutateSendReply(content);
  }
  const displayedRepliesCount = Math.max(
    repliesCount,
    replies.length,
    hasReplies ? 1 : 0,
  );

  return (
    <div className="mt-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setShowReplyInput((previous) => !previous);
            setShowReplies(true);
          }}
          aria-expanded={showReplyInput}
          className="text-sm font-medium text-burgundy hover:underline">
          {showReplyInput ? "Cancel Reply" : "Reply"}
        </button>

        {(displayedRepliesCount > 0 || showReplies) && (
          <button
            type="button"
            onClick={() => setShowReplies((previous) => !previous)}
            aria-expanded={showReplies}
            className="text-sm font-medium text-burgundy hover:underline">
            {showReplies
              ? displayedRepliesCount > 0
                ? `Hide Replies · ${displayedRepliesCount}`
                : "Hide Replies"
              : `Show ${displayedRepliesCount} ${
                  displayedRepliesCount === 1 ? "Reply" : "Replies"
                }`}
          </button>
        )}
      </div>

      {showReplies && (
        <div className="mt-2 border-l-2 border-lightPink pl-3">
          {isLoading && (
            <p className="mt-3 text-sm text-gray-500">Loading replies...</p>
          )}

          {isError && (
            <p className="mt-3 text-sm text-red-600">Could not load replies.</p>
          )}

          {!isLoading && !isError && replies.length === 0 && (
            <p className="mt-3 text-sm text-gray-500">No replies yet.</p>
          )}

          {replies.map((reply) => (
            <div
              key={reply._id}
              className="mt-3 flex items-start gap-2 rounded-xl border border-lightPink p-3">
              <img
                src={reply.commentCreator.photo}
                alt={`${reply.commentCreator.name}'s profile`}
                className="h-7 w-7 shrink-0 rounded-full object-cover"
              />

              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {reply.commentCreator.name}
                </p>
                <p className="wrap-break-word text-sm">{reply.content}</p>
              </div>
            </div>
          ))}

          {showReplyInput && (
            <form onSubmit={sendReply} className="mt-3 flex items-center gap-2">
              <input
                autoFocus
                value={replyInput}
                onChange={(event) => setReplyInput(event.target.value)}
                type="text"
                placeholder="Write a reply..."
                aria-label="Write a reply"
                className="min-w-0 flex-1 rounded-xl border border-lightPink p-2 text-sm outline-none focus:border-burgundy"
              />

              <button
                type="submit"
                disabled={isSending || !replyInput.trim()}
                aria-label="Send reply"
                className="flex min-w-16 items-center justify-center rounded-xl bg-burgundy px-3 py-2 text-sm text-white disabled:opacity-50">
                {isSending ? (
                  <Hearts
                    height="20"
                    width="36"
                    color="#fff7fe"
                    ariaLabel="hearts-loading"
                    visible
                  />
                ) : (
                  "Send"
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
