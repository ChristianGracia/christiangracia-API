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

  const reducedJson = json.map((repo: any) => {
    return {
      url: repo.html_url,
      description: repo.description,
      name: repo.name,
      language: repo.language,
      updatedAt: repo.updated_at,
    };
  });

  res.send(
    reducedJson.sort(function (a, b) {
      return a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0;
    }),
  );
});

router.get('/repo-all-commits', async (req: Request, res: Response) => {
  const { clientId, clientSecret } = process.env;
  const { repoName, amount } = req.query;

  const URL = `https://api.github.com/repos/christiangracia/${repoName}/commits?per_page=${amount}&client_id=${clientId}&client_secret=${clientSecret}`;

  const json = await returnExternalGet(URL);

  const reducedJson = json.map((commit: any) => {
    return {
      time: commit.commit.author.date,
      message: commit.commit.message,
      url: commit.html_url,
    };
  });
  res.send(reducedJson);
});

router.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../views/github.html'));
});

module.exports = router;
