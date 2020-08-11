// import * as express from 'express';
import express, { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('<h1>Welcome to my API back-end</h1>');
});

app.use(router);
const githubController = require('./controllers/github');
app.use('/github', githubController);

export default app;
