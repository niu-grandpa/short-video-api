import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { AddVideo } from '@src/models/Video';
import UploadService from '@src/services/UploadService';
import { IReq, IRes } from '../types/types';

/**
 * 上传视频
 */
async function video(req: IReq<AddVideo>, res: IRes) {
  await UploadService.addVideo(req.body);
  return res.status(HttpStatusCodes.OK).json({ data: 'ok' });
}

/**
 * 上传用户头像
 */
async function avatar(req: IReq<{ uid: string }>, res: IRes) {
  await UploadService.addAvatar(req.body);
  return res.status(HttpStatusCodes.OK).json({ data: 'ok' });
}

export default {
  video,
  avatar,
} as const;
