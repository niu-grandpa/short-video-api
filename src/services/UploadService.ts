import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import Video, { AddVideo } from '@src/models/Video';
import db from '@src/mongodb';
import { RouteError } from '@src/other/classes';

async function addVideo(data: AddVideo): Promise<void> {
  try {
    await Video.transform(data.unique);
    await Video.transform(data.unique, true);
    await new db.VideoModel(Video.new(data)).save();
  } catch (error) {
    throw new RouteError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to save video to database'
    );
  }
}

async function addAvatar({ uid }: { uid: string }): Promise<void> {
  try {
    await db.UserModel.updateOne(
      { uid },
      { $set: { avatar: `/user_avatar/${uid}.webp` } }
    );
  } catch (error) {
    throw new RouteError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to save user avatar to database'
    );
  }
}

export default {
  addVideo,
  addAvatar,
} as const;
