import express, { Request, Response } from 'express';
import { Puppeteer } from '../classes/puppeteer';
const router = express.Router();
const axios = require('axios');
import { githubService } from '../services/github-service';

router.get('/all-repos', async (req: Request, res: Response) => {
  const { gitId, gitSecret } = process.env;
  const response = await axios({
    url: `https://api.github.com/users/ChristianGracia/repos?per_page=50&sort=createdasc&client_id=${gitId}&client_secret=${gitSecret}`,
  });
  if (response.status === 200) {
    const { data } = response;
    res.status(200).send(data.length ? githubService.formatRepos(data) : []);
  } else {
    res.status(response.status).json(response);
  }
});

router.get('/repo-all-commits', async (req: Request, res: Response) => {
  const { clientId, clientSecret } = process.env;
  const { repoName, amount } = req.query;
  const response = await axios({
    url: `https://api.github.com/repos/christiangracia/${repoName}/commits?per_page=${amount}&client_id=${clientId}&client_secret=${clientSecret}`,
  });
  if (response.status === 200) {
    const { data } = response;
    res.status(200).json(githubService.formatCommits(data));
  } else {
    res.status(response.status).json(response);
  }
});

router.get('/render-commit', async (req: Request, res: Response) => {
  const puppeter = new Puppeteer();

  const response = await puppeter.getGithub();
  res.writeHead(200, {
    'Content-Type': 'image/png',
    // 'Content-Length': response,
  });
  res.end(response);
});

module.exports = router;
