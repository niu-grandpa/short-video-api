import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IAddVideo } from '@src/models/Video';
import VideoService from '@src/services/VideoService';
import { IReq, IReqQuery, IRes } from '../types/types';

/**
 * 获取1个视频
 */
async function one(req: IReqQuery<{ _id: string }>, res: IRes) {
  const data = await VideoService.getOne(req.query._id);
  return res.status(HttpStatusCodes.OK).json(data);
}

/**
 * 随机获取视频
 */
async function random(req: IReqQuery<{ size: string }>, res: IRes) {
  const data = await VideoService.getRandom(Number(req.query.size));
  return res.status(HttpStatusCodes.OK).json(data);
}

/**
 * 添加视频
 */
async function add(req: IReq<{ data: IAddVideo }>, res: IRes) {
  const data = await VideoService.addOne(req.body.data);
  return res.status(HttpStatusCodes.OK).json(data);
}

/**
 * 删除视频
 */
async function remove(req: IReqQuery<{ _id: string }>, res: IRes) {
  await VideoService.removeOne(req.query._id);
  return res.status(HttpStatusCodes.OK).end();
}

export default {
  one,
  add,
  random,
  remove,
} as const;
