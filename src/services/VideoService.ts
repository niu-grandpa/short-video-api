import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import Video, { IAddVideo, IVideo } from '@src/models/Video';
import db from '@src/mongodb';
import { RouteError } from '@src/other/classes';
import { VIDEO_NOT_FOUND_ERR } from './ActionService';

async function getOne(_id: string): Promise<IVideo> {
  const res = await db.VideoModel.findOne({ _id });
  if (!res) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, VIDEO_NOT_FOUND_ERR);
  }
  // @ts-ignore
  return res;
}

async function getRandom(size = 1): Promise<IVideo[]> {
  // 使用聚合管道的 $sample 阶段获取一个随机文档，并以数组的形式返回结果
  const res = await db.VideoModel.aggregate([{ $sample: { size } }]);
  if (!res.length) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, VIDEO_NOT_FOUND_ERR);
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

async function removeOne(_id: string): Promise<void> {
  try {
    await db.VideoModel.findOneAndRemove({ _id });
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
