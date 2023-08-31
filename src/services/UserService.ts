import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import User, { AddUser, IUser, UserLogin } from '@src/models/User';
import db from '@src/mongodb';
import { RouteError } from '@src/other/classes';

async function getAll(): Promise<IUser[]> {
  try {
    return await db.UserModel.find();
  } catch (error) {
    throw new RouteError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to get users'
    );
  }
}

async function getRandom(token: string): Promise<IUser[]> {
  try {
    const recommend: IUser[] = [];
    const user: IUser | null = await db.UserModel.findOne({ token });

    while (recommend.length < 4) {
      const [res]: IUser[] = await db.UserModel.aggregate([
        { $sample: { size: 1 } },
      ]);
      if (!user?.following.includes(res.uid)) {
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

async function addOne(data: AddUser): Promise<object> {
  const res = await db.UserModel.findOne({ phoneNumber: data.phoneNumber });
  if (res) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'User already exists');
  }
  try {
    const newUser = User.new(data);
    await new db.UserModel({
      ...newUser,
    }).save();
    return { uid: newUser.uid, token: newUser.token };
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

async function login({ token, ...rest }: UserLogin): Promise<string | object> {
  if (token) {
    if (hasSessionExpired(token)) {
      throw new RouteError(
        HttpStatusCodes.UNAUTHORIZED,
        'User login has expired'
      );
    }
    const user = await db.UserModel.findOne({ token });
    if (user?.logged) return user.token!;
    await db.UserModel.updateOne({ token }, { logged: true });
    return token;
  } else if (rest) {
    if (!(await db.UserModel.findOne({ phoneNumber: rest.phoneNumber }))) {
      return await addOne(rest);
    } else {
      const newToken = User.setUserToken(rest);
      await db.UserModel.updateOne(rest, {
        $set: { logged: true, token: newToken },
      });
      return newToken;
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
