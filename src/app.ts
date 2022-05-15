// import * as express from 'express';
import express, { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import morganMiddleware from './config/morgan';
import Logger from './config/winston';

dotenv.config();

const app = express();
app.use(morganMiddleware);

const router = express.Router();
app.use(router);

const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: '*',
  preflightContinue: false,
};

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, POST, DELETE, OPTIONS',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, Content-Type, Accept, Authorization, X-Request-With',
  );
  res.header('Access-Control-Max-Age', '86400');
  res.header('Access-Control-Expose-Headers', 'Content-Length, X-JSON');
  res.header('Content-Type', 'application/json');
  next();
});

app.use(cors(options));

app.options('*', cors(options));

app.set('port', process.env.PORT || 3000);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, 'public')));

router.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + '/views/home.html'));
});

router.get('/spotify', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + '/views/spotify.html'));
});

router.get('/email', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + '/views/email.html'));
});

router.get('/github', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + '/views/github.html'));
});

router.get('/util', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + '/views/util.html'));
});

const githubController = require('./routes/github');
app.use('/github', githubController);

const emailController = require('./routes/email');
app.use('/email', emailController);

const loginController = require('./routes/login');
app.use('/login', loginController);

const spotifyController = require('./routes/spotify');
app.use('/spotify', spotifyController);

const stocktwitsController = require('./routes/stocktwits');
app.use('/stocktwits', stocktwitsController);

const utilController = require('./routes/util');
app.use('/util', utilController);

const renderHtmlController = require('./routes/render-html');
app.use('/render-html', renderHtmlController);

app.use((req, res, next) => {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  Logger.error(
    `${req.method} - ${err.message}  - ${req.originalUrl} - ${req.ip}`,
  );
  next(err);
});

export default app;
