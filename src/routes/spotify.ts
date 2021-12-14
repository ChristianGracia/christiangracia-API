import express, { Request, Response } from 'express';
import makeRequest from '../services/fetch-service';

const router = express.Router();

// router.post('/current-song', async (req: Request, res: Response) => {
//   const client_id = process.env.SPOTIFY_CLIENT_ID;
//   const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
//   // const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN
//   const json = await makeRequest('https://api.spotify.com/v1/me', {
//     method: 'get',
//     headers: {
//       Authorization: 'Bearer ' + client_secret,
//     },
//     json: true,
//   });
//   res.send(json);
// });

module.exports = router;
