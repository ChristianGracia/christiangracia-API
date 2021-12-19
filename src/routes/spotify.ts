import express, { Request, Response } from 'express';
import { spotifyService } from '../services/spotify-service';
import { Spotify } from '../classes/spotify';


const router = express.Router();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const client_user = process.env.SPOTIFY_CLIENT_USER;
const client_password = process.env.SPOTIFY_CLIENT_PASSWORD;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URL;

const spotify = new Spotify(client_id, client_secret , client_user, client_password, redirect_uri);

router.get('/currently-playing', async function (req, res) {
  const response = await spotify.getCurrentlyPlaying();
  res.status(response.status).send(response.data ? spotifyService.formatCurrentSong(response.data) : []);
})

router.get('/recently-played', async function (req, res) {
  const response = await spotify.getRecentlyPlayed();
  res.status(response.status).send(response.data.items && response.data.items.length ? spotifyService.formatRecentlyPlayed(response.data.items) : []);
});


router.get('/callback', async function (req, res) {
  const code = req.query.code;
  spotify.setCode(code)
  await spotify.useAuthCodeToken()
  res.status(200).json({});
});

router.get('/refresh', async (req: Request, res: Response) => {
  const response = await spotify.refreshToken();
  res.status(200).send(response);
});

router.get('/use-code', async (req: Request, res: Response) => {
  const response = await spotify.useAuthCodeToken()
  res.status(200).send(response);
});

module.exports = router;
