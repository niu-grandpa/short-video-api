/**
 * Setup express server.
 */

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import express, { NextFunction, Request, Response } from 'express';

import helmet from 'helmet';
import logger from 'jet-logger';
import morgan from 'morgan';
import path from 'path';

import 'express-async-errors';

import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { NodeEnvs } from '@src/constants/misc';
import { RouteError } from '@src/other/classes';

import apiRouter from './routes/api';
import Paths from './routes/constants/Paths';

// **** Variables **** //

const app = express();

// **** AllowOrigin **** //

// 配置 cors 中间件
app.use(
  cors({
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
    // 允许跨域请求的url
    origin: [
      'http://localhost:3000',
      'http://localhost:8000',
      'http://localhost:8080',
      'http://127.0.0.1/3000',
      'https://microdio.vercel.app',
    ],
  })
);

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));
app.use(bodyParser.json());

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths.Base, apiRouter);

// Add error handler
app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    logger.err(err, true);
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  }
);

// ** Front-End Content ** //

// Set static directory
const resourceDir = path.join(__dirname, 'resources');
app.use(express.static(resourceDir));

// **** Export default **** //

export default app;
