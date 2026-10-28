export type CommentLikeType = string | { _id: string };

export interface CommentType {
  _id: string;
  content: string;
  commentCreator: User;
  post: string;
  parentComment: string | null;
  likes: CommentLikeType[];
  createdAt: string;
  repliesCount: number;
}

export interface PostType {
  _id: string;
  body: string;
  privacy: string;
  user: User;
  sharedPost: any;
  likes: any[];
  createdAt: string;
  commentsCount: number;
  topComment: any;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
  image?: string;

}

export interface User {
  _id: string;
  name: string;
  username: string;
  photo: string;
}
