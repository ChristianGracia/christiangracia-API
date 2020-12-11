import express, { Request, Response } from 'express';
const router = express.Router();
import returnExternalGet from '../../services/fetch-service';
import * as path from 'path';
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
    newObj.url = repo.html_url;
    newObj.description = repo.description;
    newObj.name = repo.name;
    newObj.language = repo.language;
    newObj.updatedAt = repo.updated_at;

    reducedJson.push(newObj);
  });
  res.send(
    reducedJson.sort(function (a, b) {
      return a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0;
    }),
  );
});

router.get('/repo-all-commits', async (req: Request, res: Response) => {
  const clientId: string = process.env.gitId;
  const clientSecret: string = process.env.gitSecret;

  const repoName = req.query.repoName;

  const amount = req.query.numberOfCommits;

  const URL = `https://api.github.com/repos/christiangracia/${repoName}/commits?per_page=${amount}&client_id=${clientId}&client_secret=${clientSecret}`;

  const json = await returnExternalGet(URL);
  const reducedJson = [];
  json.forEach((commit: any) => {
    let newObj: any = {};

    newObj.time = commit.commit.author.date;
    newObj.message = commit.commit.message;
    newObj.url = commit.html_url;

    reducedJson.push(newObj);
  });
  res.send(reducedJson);
});

router.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../views/github.html'));
});

module.exports = router;
