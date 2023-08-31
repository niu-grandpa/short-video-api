import { IComment } from '@src/models/Comments';
import User, { IUser } from '@src/models/User';
import { IVideo } from '@src/models/Video';
import genera from '@src/models/genera';
import db from '@src/mongodb';
import fs from 'fs-extra';
import path from 'path';

async function presetData() {
  try {
    await Promise.all([mockUserData(), mockVideoData() /*mockCommentData()*/]);
  } catch (error) {
    console.log('载入预置数据失败: ', error);
  }
}

async function mockUserData() {
  const data = await db.UserModel.find({});
  if (!data.length) {
    const file = await fs.readFile(
      path.join(__dirname, '../../static/users.json'),
      'utf-8'
    );
    const { data } = JSON.parse(file) as { data: IUser[] };
    data.forEach(item => {
      item.token = User.setUserToken({
        phoneNumber: item.phoneNumber,
        code: ~~(Math.random() * 1000000).toString(),
      });
      return item;
    });
    await db.UserModel.insertMany(data);
    console.log('已预置用户数据');
  }
}

async function mockVideoData() {
  const data = await db.VideoModel.find({});
  if (!data.length) {
    const file = await fs.readFile(
      path.join(__dirname, '../../static/videos.json'),
      'utf-8'
    );
    const { data } = JSON.parse(file) as { data: IVideo[] };
    data.forEach(item => {
      item.vid = genera.createId();
      return item;
    });
    await db.VideoModel.insertMany(data);
    console.log('已预置视频数据');
  }
}

async function mockCommentData() {
  const data = await db.CommentModel.find({});
  if (!data.length) {
    const file = await fs.readFile(
      path.join(__dirname, '../../static/comments.json'),
      'utf-8'
    );
    const { data } = JSON.parse(file) as { data: IComment[] };
    // data.forEach(item => {
    //   item.cid = genera.createId();
    //   return item;
    // });
    await db.CommentModel.insertMany(data);
    console.log('已预置评论数据');
  }
}

presetData();
