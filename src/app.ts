// import * as express from 'express';
import express, { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
const morgan = require('morgan');
const logger = require('./config/winston');

dotenv.config();

const app = express();
app.use(morgan('combined', { stream: logger.stream.write }));

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
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json',
  );
  next();
});

router.use(cors(options));

router.options('*', cors(options));

app.set('port', process.env.PORT || 3000);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, 'public')));

router.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + '/views/home.html'));
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

app.use((req, res, next) => {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  logger.error(
    `${req.method} - ${err.message}  - ${req.originalUrl} - ${req.ip}`,
  );
  next(err);
});

export default app;
