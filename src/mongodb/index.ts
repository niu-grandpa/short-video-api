import EnvVars from '@src/constants/EnvVars';

import logger from 'jet-logger';
import mongoose from 'mongoose';
import Schemas from './schemas';

const URI =
  EnvVars.NodeEnv !== 'development'
    ? EnvVars.DB.Uri
    : `${EnvVars.DB.Uri}/${EnvVars.DB.Database}`;

// 连接数据库
mongoose.connect(URI);

const db = mongoose.connection;

// 监听数据库连接状态
db.on('error', () => {
  logger.err('Mongodb error when connection');
});
db.once('open', function () {
  logger.info(`Mongodb server started on uri: ${URI}`);
});

// 用于操作数据库文档的模型

const UserModel = db.model('users', Schemas.User);
const VideoModel = db.model('video_posts', Schemas.Video);
const CommentModel = db.model('video_comments', Schemas.Comment);

// 为集合中的字段创建随机索引，便于$sample 阶段高性能获取随机文档
db.collection('users').createIndex({ random: 1 });
db.collection('video_posts').createIndex({ random: 1 });

export default {
  UserModel,
  VideoModel,
  CommentModel,
} as const;
