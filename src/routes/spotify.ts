import express, { Request, Response } from 'express';
import { spotifyService } from '../services/spotify-service';
import { Spotify } from '../classes/spotify';

import * as fs from 'fs';


const router = express.Router();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const client_user = process.env.SPOTIFY_CLIENT_USER;
const client_password = process.env.SPOTIFY_CLIENT_PASSWORD;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URL;

const spotify = new Spotify(client_id, client_secret, client_user, client_password, redirect_uri);

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
  await spotify.useAuthCodeToken(code)
  res.status(200).send('<html><body><div class="token">token</div></body></html>')
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

router.get('/show-code', async (req: Request, res: Response) => {
  fs.readFile('src/classes/spotify.ts', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    let html = '';
    // data.replace('\n', 'zzz')
    data.split('\n').forEach((item : string, index : number) => {
      if (index < 3) {
        console.log(item)
      }
      
      html += `<p>${item.replace(/\s/g, '&nbsp;')}</p>`;
    })
    // data.replace('\n', 'zzz').replace(/\s/g, '&nbps;')
    res.status(200).send(html);
  })
});


module.exports = router;