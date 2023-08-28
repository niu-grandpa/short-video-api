import { Router } from 'express';
import Paths from '../constants/Paths';
import Controllers from './controllers';

const videoRouter = Router();

videoRouter.get(Paths.Videos.One, Controllers.one);
videoRouter.get(Paths.Videos.Random, Controllers.random);
videoRouter.get(Paths.Videos.ByUid, Controllers.byUid);
videoRouter.post(Paths.Videos.Upload, Controllers.add);
videoRouter.delete(Paths.Videos.Remove, Controllers.remove);

export default videoRouter;
