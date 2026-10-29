import type { CommentType, PostType } from "./Posts.types";

export interface PostCardPropsType{
post:PostType,
 allComment?: CommentType[];
 className?: string;
}
