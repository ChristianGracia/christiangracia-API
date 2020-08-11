// import * as express from 'express';
import express, { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as dotenv from 'dotenv';

import returnExternalGet from './services/github-service';

dotenv.config();

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('<h1>Welcome to my API back-end</h1>');
});

router.get('/api', async (req: Request, res: Response) => {
  const clientId: string = process.env.gitId;
  const clientSecret: string = process.env.gitSecret;
  const URL: string = `https://api.github.com/users/ChristianGracia/repos?per_page=10&sort=createdasc&client_id=${clientId}&client_secret=${clientSecret}`;

  // const res = await fetch(URL);
  const json = await returnExternalGet(URL);
  console.log(json);
  res.send(json);
});

app.use(router);

export default app;
