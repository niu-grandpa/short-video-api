import logger from 'jet-logger';
import multer from 'multer';
import path from 'path';

function save_(folder: 'videos' | 'user_avatar', suffix: 'mp4' | 'webp') {
  // 配置multer中间件
  const storage = () => {
    return multer.diskStorage({
      destination: function (req, file, cb) {
        // 指定上传文件的保存目录
        cb(null, path.join(__dirname, `../resources/${folder}`));
      },
      filename({ body }, file, cb) {
        const name = `${body.unique}.${suffix}`;
        cb(null, name);
        logger.info(`Multer saved the uploaded resource ${name}`);
      },
    });
  };
  return multer({ storage: storage() });
}

export default {
  save: save_,
} as const;
