import express, { Request, Response } from 'express';
const router = express.Router();
import returnExternalGet from '../services/fetch-service';
import * as dotenv from 'dotenv';

dotenv.config();

router.get('/all-repos', async (req: Request, res: Response) => {
  const clientId: string = process.env.gitId;
  const clientSecret: string = process.env.gitSecret;
  const URL = `https://api.github.com/users/ChristianGracia/repos?per_page=20&sort=createdasc&client_id=${clientId}&client_secret=${clientSecret}`;

  const json = await returnExternalGet(URL);
  const reducedJson = [];
  json.forEach((repo: any) => {
    let newObj: any = {};
    newObj.url = repo.name;
    newObj.description = repo.description;
    newObj.name = repo.html_url;
    reducedJson.push(newObj);
  });
  res.send(reducedJson);
});

module.exports = router;
