import express, { Request, Response } from 'express';
import request from 'request';
import querystring from 'querystring';
import { spotifyService } from '../services/spotify-service';
import * as path from 'path';
import puppeteer from 'puppeteer';

const router = express.Router();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const client_user = process.env.SPOTIFY_CLIENT_USER;
const client_password = process.env.SPOTIFY_CLIENT_PASSWORD;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URL;

const minutes = 45,
  the_interval = minutes * 60 * 1000;
setInterval(function () {
  console.log('interval time');
  test();
}, the_interval);

var access_token = '';
var refresh_token = '';

async function test() {
  console.log('puppeteer incoming');
  const state = 'dkedkekdekdked';
  const scope = 'user-read-private user-read-email user-read-currently-playing';
  const browserOptions = {
    headless: true,
    ignoreHTTPSErrors: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    dumpio: true,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36',
    // defaultViewport: {
    //   width: 1600,
    //   height: 1000,
    // },
  };
  const browser = await puppeteer.launch(browserOptions);
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

  console.log(songData);

  await browser.close();
}

// test();
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

router.get('/login', async function (req, res) {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);
  const scope = 'user-read-private user-read-email user-read-currently-playing';
  console.log('before');

  // const browserOptions = {
  //   // headless: true,
  //   ignoreHTTPSErrors: true,
  //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
  //   dumpio: true,
  //   userAgent:
  //     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36',
  //   // defaultViewport: {
  //   //   width: 1600,
  //   //   height: 1000,
  //   // },
  // };
  // const browser = await puppeteer.launch(browserOptions);
  // const page = await browser.newPage();

  // try {
  //   await page.goto(
  //     'https://accounts.spotify.com/authorize?' +
  //       querystring.stringify({
  //         response_type: 'code',
  //         client_id: client_id,
  //         scope: scope,
  //         redirect_uri: redirect_uri,
  //         state: state,
  //       }),
  //   );

  //   await page.type('input[name=username]', client_user);
  //   await page.type('input[name=password]', client_password);

  //   const submitButton = await page.$x('//*[@id="login-button"]');
  //   await page.waitForTimeout(500);
  //   await submitButton[0].click();
  //   await page.waitForTimeout(1000);

  //   const innerText = await page.evaluate(() => {
  //     return JSON.parse(document.querySelector('body').innerText);
  //   });

  //   console.log('innerText now contains the JSON');
  //   console.log(innerText);

  //   await browser.close();
  //   res.status(200).json(innerText);
  // } catch {
  //   await browser.close();
  //   res.status(500).json([]);
  // }

  if (access_token) {
    console.log('access_token here');
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
    console.log('creating new token');
    refresh_token = '';
    test();
    // res.redirect(
    //   'https://accounts.spotify.com/authorize?' +
    //     querystring.stringify({
    //       response_type: 'code',
    //       client_id: client_id,
    //       scope: scope,
    //       redirect_uri: redirect_uri,
    //       state: state,
    //     }),
    // );
  }
});

router.get('/callback', function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  console.log(code);
  console.log('here');
  if (false) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch',
        }),
    );
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(client_id + ':' + client_secret).toString('base64'),
      },
      json: true,
    };

    console.log('hi');

    request.post(authOptions, function (error, response, body) {
      console.log(error);
      console.log(body);
      if (!error && response.statusCode === 200) {
        access_token = body.access_token;
        refresh_token = body.refresh_token;
        console.log('new access token');
        console.log(access_token);
        console.log('new refresh_token');
        console.log(refresh_token);
        const options = {
          url: 'https://api.spotify.com/v1/me/player/currently-playing',
          headers: {
            Authorization: 'Bearer ' + access_token,
          },
          json: true,
        };

        request.get(options, function (error, response, body) {
          console.log(error);
          res
            .status(200)
            .send(body ? spotifyService.formatCurrentSong(body) : []);
        });

        // res.redirect(
        //   '/#' +
        //     querystring.stringify({
        //       access_token: access_token,
        //       refresh_token: refresh_token,
        //     }),
        // );
      } else {
        res.redirect(
          '/#' +
            querystring.stringify({
              error: 'invalid_token',
            }),
        );
      }
    });
  }
});

router.get('/refresh_token', function (req, res) {
  const refresh_token = req.query.refresh_token;
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
      const access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

router.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../views/spotify.html'));
});

module.exports = router;
