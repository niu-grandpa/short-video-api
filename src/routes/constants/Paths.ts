/**
 * Express router paths go here.
 */

import { Immutable } from '@src/other/types';

const Paths = {
  Base: '/api',

  Users: {
    Base: '/users',
    Get: '/all',
    One: '/one',
    Update: '/update',
    Login: '/login',
    Logout: '/logout',
    Profile: '/profile',
    Recommend: '/recommend',
    HasSessionExpired: '/has-session-expired',
  },

  Videos: {
    Base: '/videos',
    One: '/one',
    ByUid: '/get-by-uid',
    Random: '/random',
    Remove: '/delete',
  },

  Actions: {
    Base: '/actions',
    Followers: '/set-followers',
    Following: '/set-following',
    Favorites: '/set-favorites',
    LikeVideo: '/like-video',
    LikeComment: '/like-comment',
    VideoWatched: '/video-watched',
  },

  Comments: {
    Base: '/comments',
    Get: '/list',
    Add: '/post',
    Edit: '/edit',
    Remove: '/delete',
  },

  Permissions: {
    Base: '/permissions',
    SetUser: '/set-user',
    SetVideo: '/set-video',
  },

  Upload: {
    Base: '/upload',
    video: '/video',
    avatar: '/user-avatar',
  },
};

// **** Export **** //

export type TPaths = Immutable<typeof Paths>;
export default Paths as TPaths;
