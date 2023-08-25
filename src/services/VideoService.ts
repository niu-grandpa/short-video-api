import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { CommentLevel } from '@src/models/Comments';
import Video, { IAddVideo, IVideo } from '@src/models/Video';
import db from '@src/mongodb';
import { RouteError } from '@src/other/classes';
import { VIDEO_NOT_FOUND_ERR } from './ActionService';

async function getNumOfComments(vid: string): Promise<number> {
  const arr1 = await db.CommentModel.find({
    belong: vid,
    level: CommentLevel.ONE,
  });
  const arr2 = [];
  for (const { cid } of arr1) {
    const res = await db.CommentModel.findOne({
      level: CommentLevel.TOW,
      belong: cid,
    });
    if (res) arr2.push(res);
  }
  return arr1.length + arr2.length;
}

async function getOne(vid: string): Promise<IVideo> {
  const res = await db.VideoModel.findOne({ vid });
  if (!res) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, VIDEO_NOT_FOUND_ERR);
  }
  res.comments = await getNumOfComments(vid);
  // @ts-ignore
  return res;
}

async function getRandom(size = 1): Promise<IVideo[]> {
  // 使用聚合管道的 $sample 阶段获取一个随机文档，并以数组的形式返回结果
  const res: IVideo[] = await db.VideoModel.aggregate([{ $sample: { size } }]);
  if (!res.length) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, VIDEO_NOT_FOUND_ERR);
  }
  for (const item of res) {
    item.comments = await getNumOfComments(item.vid);
  }
  return res;
}

async function addOne(data: IAddVideo): Promise<IVideo> {
  try {
    const res = Video.new(data);
    await new db.VideoModel(res).save();
    return res;
  } catch (error) {
    throw new RouteError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to upload video'
    );
  }
}

async function removeOne(vid: string): Promise<void> {
  try {
    await db.VideoModel.findOneAndRemove({ vid });
  } catch (error) {
    throw new RouteError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to remove video'
    );
  }
}

export default {
  getOne,
  getRandom,
  addOne,
  removeOne,
} as const;
