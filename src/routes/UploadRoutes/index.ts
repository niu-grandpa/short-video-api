import Upload from '@src/models/Upload';
import { Router } from 'express';
import Paths from '../constants/Paths';
import Controllers from './controllers';

const uploadRouter = Router();

uploadRouter.post(
  Paths.Upload.video,
  Upload.save('videos', 'mp4').single('video'),
  Controllers.video
);

uploadRouter.post(
  Paths.Upload.avatar,
  Upload.save('user_avatar', 'webp').single('avatar'),
  Controllers.avatar
);

export default uploadRouter;
