import { FaFire } from "react-icons/fa";

type CommentProps = {
  comment: {
    commentCreator: {
      photo: string;
      name: string;
    };
    content: string;
  };
  isTopComment?: boolean;
};

export default function Comment({
  comment,
  isTopComment = false,
}: CommentProps) {
  return (
    <>
      {comment && (
        <div className="my-3 rounded-2xl border border-lightPink bg-white p-4">
          {isTopComment && (
            <p className="mb-2 flex w-35 items-center justify-center gap-1 rounded-2xl border border-lightPink bg-linear-to-r from-lightPink to-softRose p-1 text-xs font-semibold text-burgundy">
              <FaFire />
              <span>Top Comment</span>
            </p>
          )}

          <div className="flex items-center gap-2">
            <img
              src={comment.commentCreator.photo}
              alt="profile photo"
              className="h-8 w-8 rounded-full"
            />

            <div>
              <p>{comment.commentCreator.name}</p>
              <p>{comment.content}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}