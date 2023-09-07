import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { GetAllUsers, IUser, UserLogin } from '@src/models/User';
import UserService from '@src/services/UserService';
import { IReq, IReqQuery, IRes } from '../types/types';

/**
 * Get all users.
 */
// @ts-ignore
async function getAll(req: IReqQuery<GetAllUsers>, res: IRes) {
  const data = await UserService.getAll(req.query);
  return res.status(HttpStatusCodes.OK).json({ data });
}

/**
 * Get one user.
 */
async function getOne(req: IReqQuery<{}>, res: IRes) {
  const data = await UserService.getOne(req.headers.authorization!);
  return res.status(HttpStatusCodes.OK).json({ data });
}

/**
 * Get random user.
 */
async function getRandom(req: IReqQuery<{}>, res: IRes) {
  const data = await UserService.getRandom(req.headers.authorization!);
  return res.status(HttpStatusCodes.OK).json({ data });
}

/**
 * Update one user.
 */
async function update(req: IReq<{ data: IUser }>, res: IRes) {
  await UserService.updateOne(req.headers.authorization!, req.body.data);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * User login.
 */
async function login(req: IReq<{ data: UserLogin }>, res: IRes) {
  const data = await UserService.login(req.body.data);
  return res.status(HttpStatusCodes.OK).json({ data });
}

/**
 * User logout.
 */
async function logout(req: IReq, res: IRes) {
  await UserService.logout(req.headers.authorization!);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * User profile.
 */
async function profile(req: IReqQuery<{ uid: string }>, res: IRes) {
  const { uid } = req.query;
  const filter = uid ? { uid } : { token: req.headers.authorization };
  const data = await UserService.getProfile(filter);
  return res.status(HttpStatusCodes.OK).json({ data });
}

async function sessionExpired(req: IReqQuery<{}>, res: IRes) {
  const data = await UserService.hasSessionExpired(req.headers.authorization!);
  return res
    .status(HttpStatusCodes[data ? 'UNAUTHORIZED' : 'OK'])
    .json({ data });
}

export default {
  getAll,
  getOne,
  update,
  login,
  logout,
  profile,
  getRandom,
  sessionExpired,
} as const;
