import mongoose from 'mongoose';

// 描述文档的结构

const User = new mongoose.Schema({
  uid: String,
  nickname: String,
  avatar: String,
  gender: Number,
  user_sign: String,
  role: Number,
  token: String,
  logged: Boolean,
  posts: Array,
  favorites: Array,
  following: Array,
  followers: Array,
  phoneNumber: String,
  created_at: Number,
  permissions: {
    no_access: Boolean,
    lock_posts: Boolean,
    lock_favorited: Boolean,
  },
});

const Video = new mongoose.Schema({
  vid: String,
  url: String,
  title: String,
  watched: Number,
  uid: String,
  likes: Array,
  comments: Number,
  author: String,
  favorites: Array,
  created_at: Number,
  gif: String,
  poster: String,
  permissions: {
    publicity: Boolean,
    private: Boolean,
    friends_only: Boolean,
  },
});

const Comment = new mongoose.Schema({
  cid: String,
  uid: String,
  level: Number,
  at_first: Boolean,
  avatar: String,
  author: String,
  belong: String,
  replies: Number,
  likes: Array,
  dislikes: Array,
  content: String,
  created_at: Number,
  updated_at: Number,
});

export default {
  User,
  Video,
  Comment,
} as const;
