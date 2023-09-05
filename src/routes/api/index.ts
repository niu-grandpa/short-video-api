import { Router } from 'express';
import Paths from '../constants/Paths';

import actionRoutes from '../ActionRoutes';
import commentRoutes from '../CommentRoutes';
import permissionRoutes from '../PermissionRoutes';
import uploadRoutes from '../UploadRoutes';
import userRouter from '../UserRoutes';
import videoRouter from '../VideoRoutes';

const apiRouter = Router();

apiRouter
  .use(Paths.Users.Base, userRouter)
  .use(Paths.Videos.Base, videoRouter)
  .use(Paths.Actions.Base, actionRoutes)
  .use(Paths.Comments.Base, commentRoutes)
  .use(Paths.Upload.Base, uploadRoutes)
  .use(Paths.Permissions.Base, permissionRoutes);

export default apiRouter;
