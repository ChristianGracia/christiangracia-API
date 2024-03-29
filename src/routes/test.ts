import express, { Request, Response } from 'express';
import { spotifyService } from '../services/spotify-service';
import { Spotify } from '../classes/spotify';
import { Test } from '../classes/test';
import { utilService } from '../services/util-service';

const router = express.Router();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const client_user = process.env.SPOTIFY_CLIENT_USER;
const client_password = process.env.SPOTIFY_CLIENT_PASSWORD;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URL;

const spotify = new Spotify(
  client_id,
  client_secret,
  client_user,
  client_password,
  redirect_uri,
);

router.get('/raw-current-song', async (req: Request, res: Response) => {
  const response = await spotify.getCurrentlyPlaying();
  res.status(response.status).send(response.data ?? []);
});

router.get('/raw-recently-played', async (req: Request, res: Response) => {
  const response = await spotify.getRecentlyPlayed();
  res.status(response.status).send(response.data.items ?? []);
});

router.get('/current-song', async (req: Request, res: Response) => {
  const apiTester = new Test();
  const response = await apiTester.requestChristianGraciaAPI(
    '/test/raw-current-song',
    'get',
  );
  res
    .status(response.status)
    .send(response.data ? spotifyService.formatCurrentSong(response.data) : []);
});

router.get('/recently-played', async (req: Request, res: Response) => {
  const apiTester = new Test();
  const response = await apiTester.requestChristianGraciaAPI(
    '/test/raw-recently-played',
    'get',
  );
  res
    .status(response.status)
    .send(
      response.data.items && response.data.items.length
        ? spotifyService.formatRecentlyPlayed(response.data.items)
        : [],
    );
});

router.get('/image', async (req: Request, res: Response) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(
    `<!DOCTYPE html><html><body><div>${await utilService.compressImage(
      '',
    )}</div></body></html>`,
  );
});
module.exports = router;
