import db from '@src/mongodb';
import fs from 'fs-extra';
import path from 'path';

async function presetVideoData() {
  try {
    const realData = await db.VideoModel.find({});
    if (!realData.length) {
      const file = await fs.readFile(
        path.join(__dirname, '../../static/videos.json'),
        'utf-8'
      );
      await db.VideoModel.insertMany(JSON.parse(file).data);
      console.log('已加载预置视频数据');
    }
  } catch (error) {
    console.log('读取视频数据失败: ');
  }
}

presetVideoData();
