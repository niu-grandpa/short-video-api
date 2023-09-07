import mongoose, { Model } from 'mongoose';
import { GetAllUsers, IUser } from './User';

type UpdateOnceAuthorInfoReturnType = (
  getUsers: (data: GetAllUsers) => Promise<IUser[]>,
  dbModel: Model<any>
) => Promise<void>;

/**
 * 用于获取视频数据或评论列表数据时，同步一次所有用户的头像、昵称
 */
function updateOnceAuthorInfo(count: number): UpdateOnceAuthorInfoReturnType {
  let c = count;
  return async (getUsers, dbModel) => {
    if (c++ > 1) return;
    let page = 0;
    while (true) {
      const users = await getUsers({ page: page++, size: 50 });
      if (!users.length) break;
      for (const { uid, avatar, nickname } of users) {
        try {
          await dbModel.updateMany(
            { uid },
            { $set: { avatar, author: nickname } }
          );
        } catch (error) {
          continue;
        }
      }
    }
  };
}

function validate() {}

function createId() {
  return new mongoose.Types.ObjectId().toString();
}

export default {
  validate,
  createId,
  updateOnceAuthorInfo,
} as const;
