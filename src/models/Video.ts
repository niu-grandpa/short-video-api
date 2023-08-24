import genera from './genera';

export interface IVideo {
  vid: string;
  url: string;
  title: string;
  watched: number;
  uid: string;
  author: string;
  likes: string[];
  favorites: string[];
  created_at: number;
  permissions: {
    publicity: boolean;
    private: boolean;
    friends_only: boolean;
  };
}

export interface IAddVideo {
  url: string;
  title: string;
  name: string;
  uid: string;
}

/**
 * 创建视频数据
 */
function new_(data: IAddVideo): IVideo {
  return {
    ...data,
    vid: genera.createId(),
    author: '',
    watched: 0,
    likes: [],
    favorites: [],
    permissions: {
      publicity: true,
      private: false,
      friends_only: false,
    },
    created_at: Date.now(),
  };
}

export default {
  new: new_,
} as const;
