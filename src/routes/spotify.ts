import express, { Request, Response } from 'express';
import request from 'request';
import querystring from 'querystring';
import { spotifyService } from '../services/spotify-service';
import { Spotify } from '../classes/spotify';

import * as path from 'path';
import puppeteer from 'puppeteer';

const router = express.Router();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const client_user = process.env.SPOTIFY_CLIENT_USER;
const client_password = process.env.SPOTIFY_CLIENT_PASSWORD;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URL;

const spotify = new Spotify(client_id, client_secret , client_user, client_password, redirect_uri);

const minutes = 30,
  intervalLength = minutes * 60 * 1000;
setInterval(function () {
  access_token = '';
  refreshToken();
}, intervalLength);

let access_token = '';
let refresh_token = '';

async function refreshToken() {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(client_id + ':' + client_secret).toString('base64'),
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('refreshed token using refresh!');
      refresh_token = body.refresh_token;
      access_token = body.access_token;

      const emailOptions = {
        url: 'https://christiangracia-api.herokuapp.com/email/job-ran',
        form: {
          jobType: 'refresh',
          message: 'token refreshed',
        },
      };

      request.post(emailOptions, function (error, response, body) {
        console.error('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
      });
    }
  });
}

// getToken();

async function getToken() {
  console.log('puppeteer incoming xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  const state = 'dkedkekdekdked';
  const scope = 'user-read-private user-read-email user-read-currently-playing user-read-recently-played';
  const browserOptions = {
    headless: true,
    ignoreHTTPSErrors: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    dumpio: true,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36',
  };
  const browser = await puppeteer.launch(browserOptions);

  try {
    const page = await browser.newPage();
    await page.goto(
      'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: 'code',
          client_id: client_id,
          scope: scope,
          redirect_uri: redirect_uri,
          state: state,
        }),
    );
    await page.waitForTimeout(2000);
    await page.type('input[name=username]', client_user);
    await page.type('input[name=password]', client_password);
  
    const submitButton = await page.$x('//*[@id="login-button"]');
    await page.waitForTimeout(1000);
    await submitButton[0].click();
    await page.waitForTimeout(5000);
  
    const songData = await page.evaluate(() => {
      return JSON.parse(document.querySelector('body').innerText);
    });
  
    const emailOptions = {
      url: 'https://christiangracia-api.herokuapp.com/email/job-ran',
      form: {
        jobType: 'puppeteer script',
        message: 'puppeteer script ran',
      },
    };
  
    request.post(emailOptions, function (error, response, body) {
      console.error('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
    });
    await browser.close();
  } catch {
    await browser.close();
  }
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

router.get('/currently-playing', async function (req, res) {
  console.log('/currently-playing');
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  if (access_token) {
    console.log('access_token here');
    console.log(access_token);
    const options = {
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
      json: true,
    };

    request.get(options, function (error, response, body) {
      if (body) {
        res
          .status(200)
          .send(body ? spotifyService.formatCurrentSong(body) : []);
      } else {
        console.log('token fail attempting refresh');
        const authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          headers: {
            Authorization:
              'Basic ' +
              new Buffer(client_id + ':' + client_secret).toString('base64'),
          },
          form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
          },
          json: true,
        };

        request.post(authOptions, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            console.log('refreshed!');
            console.log(body);
            refresh_token = body.refresh_token;
            access_token = body.access_token;
            console.log('\x1b[36m%s\x1b[0m', 'Access token received through puppeteer');
            console.log('\x1b[36m%s\x1b[0m', 'access_token');
            const options = {
              url: 'https://api.spotify.com/v1/me/player/currently-playing',
              headers: {
                Authorization: 'Bearer ' + access_token,
              },
              json: true,
            };

            request.get(options, function (error, response, body) {
              if (body) {
                res
                  .status(200)
                  .send(body ? spotifyService.formatCurrentSong(body) : []);
              }
            });
          }
        });
      }
    });
  } else {
    getToken();
  }
});

router.get('/recently-played', async function (req, res) {
  console.log('/recently-played');
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  if (access_token) {
    console.log('access_token here');
    console.log(access_token);
    const options = {
      url: 'https://api.spotify.com/v1/me/player/recently-played?limit=50',
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
      json: true,
    };

    request.get(options, function (error, response, body) {
      if (body) {
        res
          .status(200)
          .send(body.items && body.items.length ? spotifyService.formatRecentlyPlayed(body.items) : []);
      } else {
        console.log('token fail attempting refresh');
        const authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          headers: {
            Authorization:
              'Basic ' +
              new Buffer(client_id + ':' + client_secret).toString('base64'),
          },
          form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
          },
          json: true,
        };

        request.post(authOptions, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            console.log('refreshed!');
            console.log(body);
            refresh_token = body.refresh_token;
            access_token = body.access_token;

            const options = {
              url: 'https://api.spotify.com/v1/me/player/recently-played?limit=50',
              headers: {
                Authorization: 'Bearer ' + access_token,
              },
              json: true,
            };

            request.get(options, function (error, response, body) {
              if (body) {
                res
                  .status(200)
                  .send(body ? spotifyService.formatRecentlyPlayed(body) : []);
              }
            });
          }
        });
      }
    });
  } else {
    getToken();
  }
});


router.get('/callback', async function (req, res) {
  const code = req.query.code;

  console.log('code received ' + code);
  console.log('callback ran');
  const tokens = await spotify.useAuthCodeToken(code)
  console.log('received')
  // console.log(tokens);
  res.status(200).json({});

  //   const authOptions = {
  //     url: 'https://accounts.spotify.com/api/token',
  //     form: {
  //       code: code,
  //       redirect_uri: redirect_uri,
  //       grant_type: 'authorization_code',
  //     },
  //     headers: {
  //       Authorization:
  //         'Basic ' +
  //         new Buffer(client_id + ':' + client_secret).toString('base64'),
  //     },
  //     json: true,
  //   };

  //   request.post(authOptions, function (error, response, body) {
  //     console.log(error);
  //     console.log(body);
  //     if (!error && response.statusCode === 200) {
  //       access_token = body.access_token;
  //       refresh_token = body.refresh_token;
  //       console.log('new access token');
  //       console.log(access_token);
  //       console.log('new refresh_token');
  //       console.log(refresh_token);
  //       const options = {
  //         url: 'https://api.spotify.com/v1/me/player/currently-playing',
  //         headers: {
  //           Authorization: 'Bearer ' + access_token,
  //         },
  //         json: true,
  //       };

  //       request.get(options, function (error, response, body) {
  //         console.log(error);
  //         res
  //           .status(200)
  //           .send(body ? spotifyService.formatCurrentSong(body) : []);
  //       });
  //     }
  //   });
});

router.get('/test', async function (req, res) {
  await spotify.puppeteerLogInAuth();
  //res.send(await spotify.puppeteerLogInAuth());
});

router.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../views/spotify.html'));
});

module.exports = router;
