import express, { Request, Response } from 'express';
import { spotifyService } from '../services/spotify-service';
import { Spotify } from '../classes/spotify';
import { Test } from '../classes/test';

const router = express.Router();
const env = process.env.NODE_ENV === 'production';
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const client_user = process.env.SPOTIFY_CLIENT_USER;
const client_password = process.env.SPOTIFY_CLIENT_PASSWORD;
const redirect_uri = env
  ? process.env.SPOTIFY_REDIRECT_URL
  : process.env.SPOTIFY_REDIRECT_URL_LOCAL;

const spotify = new Spotify(
  client_id,
  client_secret,
  client_user,
  client_password,
  redirect_uri,
);

router.get('/currently-playing', async (req: Request, res: Response) => {
  const response = await spotify.getCurrentlyPlaying();
  res
    .status(response.status)
    .send(
      response.data ? [spotifyService.formatCurrentSong(response.data)] : [],
    );
});

router.get('/recently-played', async (req: Request, res: Response) => {
  const { query } = req;
  const response = await spotify.getRecentlyPlayed(
    query?.amount ? Number(query.amount) : 50,
  );
  res
    .status(response.status)
    .send(
      response.data.items && response.data.items.length
        ? spotifyService.formatRecentlyPlayed(response.data.items)
        : [],
    );
});

router.get('/callback', async (req: Request, res: Response) => {
  const code = req.query.code;
  await spotify.useAuthCodeToken(code);
  res
    .status(200)
    .send('<html><body><div class="token">token</div></body></html>');
});

router.get('/refresh', async (req: Request, res: Response) => {
  const response = await spotify.refreshToken();
  res.status(200).send(response);
});

router.get('/use-code', async (req: Request, res: Response) => {
  const response = await spotify.useAuthCodeToken(spotify.getCode());
  res.status(200).send(response);
});

router.get('/reset', async (req: Request, res: Response) => {
  const response = await spotify.handleTokenError();
  res.status(200).send(response);
});

module.exports = router;
