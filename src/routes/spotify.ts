import express, { Request, Response } from 'express';
import makeRequest from '../services/fetch-service';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/current-song', async (req: Request, res: Response) => {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const key = new Buffer(client_id + ':' + client_secret).toString('base64');
  console.log(key);

  const requestOptions = {
    method: 'post',
    headers: {
      Authorization: 'Basic ' + key,
    },
    form: {
      grant_type: 'client_credentials',
    },
    json: true,
  };
  const resp = await fetch(
    'https://accounts.spotify.com/api/token',
    requestOptions,
  );

  console.log(resp);
  res.send(JSON.parse(resp));
  // const json = await res.json();

  // res.send(json);
});

module.exports = router;
