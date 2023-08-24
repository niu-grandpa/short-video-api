import { IUser } from './User';
import { IVideo } from './Video';

export interface IPUser {
  token: string;
  permissions: IUser['permissions'];
}

export interface IPVideo {
  vid: string;
  uid: string;
  permissions: IVideo['permissions'];
}
