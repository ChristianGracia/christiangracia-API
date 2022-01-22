import express, { Request, Response } from 'express';
const router = express.Router();
import makeRequest from '../services/fetch-service';
import { githubService } from '../services/github-service';
import * as path from 'path';

router.get('/all-repos', async (req: Request, res: Response) => {
  const { gitId, gitSecret } = process.env;

  const URL = `https://api.github.com/users/ChristianGracia/repos?per_page=50&sort=createdasc&client_id=${gitId}&client_secret=${gitSecret}`;

  const json = await makeRequest(URL);

  res.send(json.length ? githubService.formatRepos(json) : json);
});

router.get('/repo-all-commits', async (req: Request, res: Response) => {
  const { clientId, clientSecret } = process.env;
  const { repoName, amount } = req.query;

  const URL = `https://api.github.com/repos/christiangracia/${repoName}/commits?per_page=${amount}&client_id=${clientId}&client_secret=${clientSecret}`;

  const json = await makeRequest(URL);
  res.send(githubService.formatCommits(json));
});

router.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../views/github.html'));
});

module.exports = router;
