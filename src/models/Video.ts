import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { GenericPagination } from '@src/routes/types/types';
import ffmpeg from 'fluent-ffmpeg';
import logger from 'jet-logger';
import path from 'path';
import genera from './genera';

export interface IVideo {
  vid: string;
  url: string;
  title: string;
  watched: number;
  uid: string;
  author: string;
  gif: string;
  poster: string;
  likes: string[];
  favorites: string[];
  comments: number;
  created_at: number;
  permissions: {
    publicity: boolean;
    private: boolean;
    friends_only: boolean;
  };
}

export interface AddVideo {
  uid: string;
  author: string;
  title: string;
  url: string;
  unique: string;
}

export interface GetManyOfVideoByUid extends GenericPagination {
  uid: string[];
}

const ISGIF = '__isGIF__';

// 设置二进制客户端路径
ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * 转换视频为图片和动态图
 * @param filename 视频文件名
 * @param dynamic 是否输出为动态图
 */
function transform2Img(filename: string, dynamic?: boolean) {
  const output = path.join(__dirname, `../resources/video_posters/${filename}`);
  const videoPath = path.join(__dirname, `../resources/videos/${filename}.mp4`);

  // 读入路径
  const Ffmpeg = ffmpeg(videoPath);

  return new Promise((resovle, reject) => {
    if (dynamic) {
      // 转换动态图
      Ffmpeg.outputOptions('-vf', 'scale=325:600:flags=lanczos', '-loop', '0')
        // 设置输出动图的帧率
        .withFPS(120)
        // 输出路径
        .output(`${output}${ISGIF}.webp`);
    } else {
      // 转换静态图
      Ffmpeg.outputOptions('-y', '-f', 'image2', '-frames', '1').output(
        `${output}.webp`
      );
    }
    Ffmpeg
      // 禁用音频输出
      .noAudio()
      .on('end', resovle)
      .on('error', err => {
        logger.err(`Some error in: ${err}`);
        reject(err);
      })
      .run();
  });
}

/**
 * 创建视频数据
 */
function new_(data: AddVideo): IVideo {
  const { unique: name } = data;
  return {
    ...data,
    watched: 0,
    comments: 0,
    likes: [],
    favorites: [],
    created_at: Date.now(),
    vid: genera.createId(),
    url: `/videos/${name}.mp4`,
    poster: `/video_posters${name}.webp`,
    gif: `/video_posters/${name}${ISGIF}.webp`,
    permissions: {
      publicity: true,
      private: false,
      friends_only: false,
    },
  };
}

export default {
  new: new_,
  transform: transform2Img,
} as const;
