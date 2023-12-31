import EnvVars from '@src/constants/EnvVars';
import { GenericPagination } from '@src/routes/types/types';
import jwt, { JwtPayload } from 'jsonwebtoken';

export enum UserRoles {
  Standard,
  Admin,
  Anchor,
}

export enum UserGender {
  Unknown,
  Man,
  Female,
}

export interface IUser {
  uid: string;
  role: UserRoles;
  token: string;
  logged: boolean;
  posts: string[];
  favorites: string[];
  following: string[];
  followers: string[];
  phoneNumber: string;
  nickname: string;
  avatar: string;
  gender: UserGender;
  user_sign: string;
  created_at: number;
  permissions: {
    no_access: boolean;
    lock_posts: boolean;
    lock_favorited: boolean;
  };
}

export interface GetAllUsers extends GenericPagination {
  word?: string;
}

export interface AddUser {
  phoneNumber: string;
  code: string;
}

export interface UserLogin extends AddUser {
  token?: string;
}

/**
 * Create new User.
 */
function new_({ phoneNumber, code }: AddUser): IUser {
  const timestamp = Date.now();
  const uid = `2${phoneNumber.slice(6)}${timestamp % 100}${code[0]}`;
  return {
    uid,
    role: UserRoles.Standard,
    gender: UserGender.Unknown,
    token: setUserToken({ uid, phoneNumber }),
    logged: true,
    posts: [],
    favorites: [],
    following: [],
    followers: [],
    phoneNumber,
    avatar: '',
    user_sign: '',
    created_at: Date.now(),
    nickname: `用户_${timestamp}`,
    permissions: {
      no_access: false,
      lock_posts: false,
      lock_favorited: false,
    },
  };
}

function setUserToken(payload: object): string {
  const expiresIn = EnvVars.Jwt.Exp;
  return jwt.sign(payload, EnvVars.Jwt.Secret, { expiresIn });
}

function isTokenExpired(token: string) {
  try {
    const decoded = jwt.verify(token, EnvVars.Jwt.Secret);
    const isExpired = Date.now() >= (decoded as JwtPayload).exp! * 1000;
    return isExpired;
  } catch (error) {
    return true;
  }
}

export default {
  new: new_,
  setUserToken,
  isTokenExpired,
} as const;
