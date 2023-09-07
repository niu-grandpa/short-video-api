import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import User, { AddUser, GetAllUsers, IUser, UserLogin } from '@src/models/User';
import db from '@src/mongodb';
import { RouteError } from '@src/other/classes';
import logger from 'jet-logger';

async function getAll(data: GetAllUsers): Promise<IUser[]> {
  const { word, sort, page, size } = data;
  const filter = word
    ? { nickname: { $regex: RegExp(word), $options: 'i' } }
    : {};

  try {
    return (await db.UserModel.find(filter)
      .sort({ create_at: sort ?? 1 })
      .skip(page * size)
      .limit(size)) as IUser[];
  } catch (error) {
    throw new RouteError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'An error occurred while get users'
    );
  }
}

async function getRandom(token: string): Promise<IUser[]> {
  try {
    const recommend: IUser[] = [];
    const user: IUser | null = await db.UserModel.findOne({ token });

    // 不推荐已关注的用户
    while (recommend.length < 2) {
      const r1 = recommend[0];
      const [res]: IUser[] = await db.UserModel.aggregate([
        { $sample: { size: 1 } },
      ]);
      if (
        r1?.uid !== res.uid &&
        user?.uid !== res.uid &&
        !user?.following.includes(res.uid)
      ) {
        recommend.push(res);
      }
    }

    return recommend;
  } catch (error) {
    throw new RouteError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to get random users'
    );
  }
}

async function getOne(token: string): Promise<IUser> {
  const user = await db.UserModel.findOne({ token });
  if (!user) {
    throw new RouteError(HttpStatusCodes.BAD_GATEWAY, 'User not found');
  }
  // @ts-ignore
  return user;
}

async function getProfile(filter: {
  uid?: string;
  token?: string;
}): Promise<Partial<IUser>> {
  const user = await db.UserModel.findOne(filter, { _id: 0 });

  if (!user) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      'Internal server error when find user profile'
    );
  }

  user.uid = '';
  user.token = '';
  user.phoneNumber = '';
  user.created_at = -1;
  user.logged = null as unknown as boolean;

  return user as IUser;
}

async function addOne(data: AddUser): Promise<string> {
  try {
    const newUser = User.new(data);
    await new db.UserModel({
      ...newUser,
    }).save();
    logger.info('A new user was created');
    return newUser.token;
  } catch (error) {
    throw new RouteError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'User registration failed'
    );
  }
}

async function updateOne(
  token: string,
  newData: Partial<IUser>
): Promise<void> {
  try {
    const oldData = await getOne(token);
    const update = {
      role: newData.role ?? oldData.role,
      gender: newData.gender ?? oldData.gender,
      avatar: newData.avatar ?? oldData.avatar,
      nickname: newData.nickname ?? oldData.nickname,
      user_sign: newData.user_sign ?? oldData.user_sign,
      permissions: newData.permissions ?? oldData.permissions,
    };
    await db.UserModel.updateOne({ token }, { $set: update });
  } catch (error) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      'Failed to update user profile, maybe the user does not exist'
    );
  }
}

function hasSessionExpired(token: string): boolean {
  return User.isTokenExpired(token);
}

async function login({ token, ...rest }: UserLogin): Promise<string> {
  if (token) {
    if (hasSessionExpired(token)) {
      throw new RouteError(
        HttpStatusCodes.UNAUTHORIZED,
        'User login has expired'
      );
    }
    await db.UserModel.updateOne({ token }, { $set: { logged: true } });
    return token;
  } else if (rest) {
    const { phoneNumber } = rest;
    const user = await db.UserModel.findOne({ phoneNumber });
    if (user) {
      // 使用手机号登录每次都刷新token
      const newToken = User.setUserToken(rest);
      await db.UserModel.updateOne(
        { phoneNumber },
        { $set: { logged: true, token: newToken } }
      );
      return newToken;
    } else {
      return await addOne(rest);
    }
  }
  return '';
}

async function logout(token: string): Promise<void> {
  await db.UserModel.updateOne({ token }, { $set: { logged: false } });
}

export default {
  login,
  logout,
  getAll,
  getOne,
  getRandom,
  addOne,
  updateOne,
  getProfile,
  hasSessionExpired,
};
