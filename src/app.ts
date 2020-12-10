// import * as express from 'express';
import express, { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, 'public')));

//will move this later
const homePage = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Christian Gracia API Homepage</title>

    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>

  <body>
    <div
      style="
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
      "
    >
      <div style="margin-top: 60px;">
        <h1 style="color: #d4af37;">Welcome to my API</h1>
      </div>
      <div style="margin-top: 12px;">
        <h2 style="color: #d4af37;">
          This API serves
          <a style="" href="https://christiangracia.com">
            christiangracia.com
          </a>
        </h2>
      </div>

      <h3 style="font-weight: bold;">
        Public Routes
      </h3>

      <div style="margin-top: 20px; margin-bottom: 20px;">
        <a>/github/all-repos</a>
      </div>

      <div style="margin-top: 20px;">
        <p style="color: #d4af37;">
          created by christian gracia
        </p>
      </div>
    </div>
  </body>
</html>

`;

router.get('/', (req: Request, res: Response) => {
  res.send(homePage);
});

const githubController = require('./controllers/github');
app.use('/github', githubController);

const emailController = require('./controllers/email');
app.use('/email', emailController);

const loginController = require('./controllers/login');
app.use('/login', loginController);

export default app;
