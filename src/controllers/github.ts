import express, { Request, Response } from 'express';
const router = express.Router();
import returnExternalGet from '../services/fetch-service';
import * as dotenv from 'dotenv';

dotenv.config();

router.get('/all-repos', async (req: Request, res: Response) => {
  console.log('hi');
  const clientId: string = process.env.gitId;
  const clientSecret: string = process.env.gitSecret;
  const URL: string = `https://api.github.com/users/ChristianGracia/repos?per_page=10&sort=createdasc&client_id=${clientId}&client_secret=${clientSecret}`;

  const json = await returnExternalGet(URL);
  res.send(json);
});

module.exports = router;
