import { GenericPagination } from '@src/routes/types/types';
import genera from './genera';

export const enum CommentLevel {
  ONE,
  TOW,
}

export interface IComment {
  cid: string;
  uid: string;
  avatar: string;
  author: string;
  belong: string;
  replies: number;
  likes: number[];
  dislikes: number[];
  content: string;
  level: CommentLevel;
  created_at: number;
  updated_at: number;
}

export interface AddComment {
  uid: string;
  content: string;
  belong: string;
  level: CommentLevel;
}

export interface UpdateComment {
  cid: string;
  content: string;
}

export interface LikeComment {
  uid: string;
  cid: string;
  flag: boolean;
  reset?: boolean;
}

export interface GetComments extends GenericPagination {
  belong: string;
  level: CommentLevel;
}

/**
 * 创建新评论
 */
function new_(data: AddComment & { author: string; avatar: string }): IComment {
  return {
    cid: genera.createId(),
    ...data,
    author: '',
    avatar: '',
    replies: 0,
    likes: [],
    dislikes: [],
    updated_at: 0,
    created_at: Date.now(),
  };
}

export default {
  new: new_,
} as const;
