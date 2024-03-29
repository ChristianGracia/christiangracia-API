const axios = require('axios');
import puppeteer from 'puppeteer';
import querystring from 'querystring';
import Logger from '../config/winston';
import { utilService } from '../services/util-service';
import Constants from '../config/constants';

const env = process.env.NODE_ENV === 'production';
export class Spotify {
  public spotifyUrl: string = Constants.SPOTIFY_TOKEN;
  public access_token: string = '';
  public refresh_token: string = '';
  public client_id: string = '';
  public client_secret: string = '';
  public client_password: string = '';
  public redirect_uri: string = '';
  public client_user: string = '';
  public puppeteerRunning: boolean = false;
  public puppeteerSuccess: boolean = false;
  public code: string = '';

  constructor(
    client_id,
    client_secret,
    client_user,
    client_password,
    redirect_uri,
  ) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.client_user = client_user;
    this.client_password = client_password;
    this.redirect_uri = redirect_uri;
  }

  private setAccessToken(token, method = '') {
    this.access_token = token;
    if (method === 'auth_code_flow') {
      Logger.info(
        `---------------------Access Token Set | method: ${method}---------------------`,
      );
      this.puppeteerSuccess = true;
    } else if (method === 'refresh_token') {
      Logger.info('---------------------Token refreshed ---------------------');
    }
  }
  private setRefreshToken(token) {
    this.refresh_token = token;
  }

  public getCode() {
    if (this.code) {
      Logger.info('---------------------Code Get---------------------');
      return this.code;
    } else return false;
  }

  puppeteerLogInAuth = async () => {
    if (!this.client_id || !this.client_secret) {
      return { Error: 'Missing client id or client secret' };
    }
    if (this.puppeteerRunning) {
      Logger.error(
        'zzzzzzzzzzzzzzzzzzzzzzzz Bot already running zzzzzzzzzzzzzzzzzzzzzz',
      );
      return { Error: 'Bot already running' };
    } else {
      this.puppeteerRunning = true;
    }
    try {
      const promises = [];
      const startTime = new Date().getTime();
      promises.push(
        new Promise((resolve) => {
          (async () => {
            const env = process.env.NODE_ENV === 'production';
            Logger.warn(
              `---------------------puppeteer starting | headless ${env}---------------------`,
            );
            const state = 'dkedkekdekdked';
            const scope =
              'user-read-private user-read-email user-read-currently-playing user-read-recently-played';
            const browserOptions = {
              headless: env,
              ignoreHTTPSErrors: true,
              args: ['--no-sandbox', '--disable-setuid-sandbox'],
              userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
              ...(process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD && {
                executablePath: '/usr/bin/chromium-browser',
                ignoreDefaultArgs: ['--disable-extensions'],
                slowMo: 25,
              }),
            };
            const browser = await puppeteer.launch(browserOptions);

            try {
              const page = await browser.newPage();
              await page.goto(
                'https://accounts.spotify.com/authorize?' +
                  querystring.stringify({
                    response_type: 'code',
                    client_id: this.client_id,
                    scope: scope,
                    redirect_uri: this.redirect_uri,
                    state: state,
                  }),
                { waitUntil: 'networkidle2' },
              );
              Logger.info(
                `--------------------- page start ${utilService.timePassed(
                  startTime,
                )}---------------------`,
              );
              await page.waitForTimeout(
                utilService.randonNumberInRange(1300, 2000),
              );
              Logger.info(
                `--------------------- after 2.5 second ${utilService.timePassed(
                  startTime,
                )}---------------------`,
              );
              await page.waitForSelector('input[id=login-username]', {
                visible: true,
              });
              await page.waitForTimeout(
                utilService.randonNumberInRange(500, 1000),
              );
              await page.type('input[id=login-username]', this.client_user);
              Logger.info(
                `--------------------- username done ${utilService.timePassed(
                  startTime,
                )}---------------------`,
              );
              await page.waitForSelector('input[id=login-password]', {
                visible: true,
              });
              await page.waitForTimeout(
                utilService.randonNumberInRange(500, 1000),
              );
              await page.type('input[id=login-password]', this.client_password);
              Logger.info(
                `--------------------- password done ${utilService.timePassed(
                  startTime,
                )}---------------------`,
              );
              await page.waitForXPath('//*[@id="login-button"]', {
                visible: true,
              });
              Logger.info(
                `--------------------- login button found ${utilService.timePassed(
                  startTime,
                )}---------------------`,
              );
              const submitButton = await page.$x('//*[@id="login-button"]');
              await page.waitForTimeout(
                utilService.randonNumberInRange(1000, 1500),
              );
              await submitButton[0].click();
              await page.waitForTimeout(
                utilService.randonNumberInRange(1000, 2000),
              );
              Logger.info(
                `--------------------- login button clicked ${utilService.timePassed(
                  startTime,
                )}---------------------`,
              );
              await page.waitForTimeout(5000);
              await page.waitForXPath('//*[contains(text(), "token")]', {
                visible: true,
              });
              await page.waitForTimeout(3000);
              Logger.info(
                `--------------------- success ${utilService.timePassed(
                  startTime,
                )}---------------------`,
              );
              await browser.close();
              Logger.warn(
                `---------------------puppeteer closed ${utilService.timePassed(
                  startTime,
                )}---------------------`,
              );
            } catch (err) {
              console.log(err);
              Logger.error(
                `--------------------- puppeteer error ${utilService.timePassed(
                  startTime,
                )} ---------------------`,
              );
              await browser.close();
            }
            resolve(true);
          })();
        }),
      );
      await Promise.all(promises);

      this.puppeteerRunning = false;
      this.setRefreshTokenInterval();
      Logger.warn(
        `--------------------- promises done ${utilService.timePassed(
          startTime,
        )}---------------------`,
      );
      return {
        access_token: this.access_token,
      };
    } catch (err) {
      this.puppeteerRunning = false;
      this.sendEmail('Auth', 'Password Error');
      Logger.error(
        '--------------------- puppeteer error ---------------------',
      );
      return {};
    }
  };

  useAuthCodeToken = async (code) => {
    const startTime = new Date().getTime();
    Logger.warn(
      '---------------------Getting token with code---------------------',
    );
    if (!code) {
      Logger.error(
        '---------------------Puppeteer Login Auth Code flow not ran---------------------',
      );
      return { Error: 'Puppeteer Login Auth Code flow not ran' };
    }
    try {
      Logger.info(
        '--------------------- Using auth code ---------------------',
      );
      const data = {
        code: code,
        redirect_uri: this.redirect_uri,
        grant_type: 'authorization_code',
      };
      return axios({
        url: this.spotifyUrl,
        method: 'post',
        params: data,
        headers: {
          Authorization:
            'Basic ' +
            new Buffer(this.client_id + ':' + this.client_secret).toString(
              'base64',
            ),
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => {
          if (response.status === 200) {
            Logger.warn(
              `--------------------- Access token set ${utilService.timePassed(
                startTime,
              )}---------------------`,
            );
            const { access_token, refresh_token } = response.data;
            this.setAccessToken(access_token, 'auth_code_flow');
            this.setRefreshToken(refresh_token);
            return { auth: true };
          } else {
            Logger.error(
              '--------------------- auth code error in token generation ---------------------',
            );
            return { Error: 'Error retrieving token ' };
          }
        })
        .catch((error) => {
          Logger.error(
            '--------------------- auth code error in token generation ---------------------',
          );
          return { error };
        });
    } catch (err) {
      Logger.error(
        '--------------------- auth code error in token generation ---------------------',
      );
      return { Error: 'Error retrieving token using authorization code' };
    }
  };
  sendEmail = async (jobType, message) => {
    Logger.warn('--------------------- sending email ---------------------');
    const data = {
      jobType: `${jobType}`,
      message: `${message}`,
    };

    const res = await axios({
      url: env
        ? 'https://christiangracia-api.herokuapp.com/email/job-ran'
        : 'http://localhost:3000/email/job-ran',
      method: 'post',
      data,
    });
    if (res.status === 200) {
      console.warn(
        `--------------------------- ${jobType} email sent ---------------------------`,
      );
      return res.data;
    } else {
      return { Error: 'Error sending email' };
    }
  };
  getCurrentlyPlaying = async () => {
    if (this.access_token === '') {
      console.log('server started, no token found');
      await this.handleTokenError();
    }

    return await axios({
      url: Constants.SPOTIFY_CURRENT_SONG,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + this.access_token,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  };
  getRecentlyPlayed = async (amount: number = 50) => {
    if (this.access_token === '') {
      console.log('server started, no token found');
      await this.handleTokenError();
    }

    return await axios({
      url: Constants.SPOTIFY_RECENTLY_PLAYED + amount,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + this.access_token,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  };

  refreshToken = async () => {
    if (!this.refreshToken) {
      return { Error: 'Missing refresh token' };
    }
    Logger.warn('---------------------REFRESHING TOKEN ---------------------');
    const data = {
      grant_type: 'refresh_token',
      refresh_token: this.refresh_token,
    };

    return axios({
      url: this.spotifyUrl,
      method: 'post',
      params: data,
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(this.client_id + ':' + this.client_secret).toString(
            'base64',
          ),
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          const { access_token } = response.data;
          this.setAccessToken(access_token, 'refresh_token');
          this.setRefreshTokenInterval();
          return { auth: true };
        } else {
          await this.handleTokenError();
          return {};
        }
      })
      .catch(async (error) => {
        await this.handleTokenError();
        return { error };
      });
  };

  setRefreshTokenInterval = async () => {
    setTimeout(() => {
      this.access_token = '';
      this.refreshToken();
    }, 60 * 1000 * 50);
  };
  handleTokenError = async () => {
    if (this.access_token !== '') {
      Logger.error(
        '---------------------RESETTING TOKEN ---------------------',
      );
      this.access_token = '';
    } else {
      Logger.warn(
        '---------------------GETTING FIRST TIME TOKEN ---------------------',
      );
    }
    const promises = [];
    promises.push(
      new Promise((resolve) => {
        (async () => {
          await this.puppeteerLogInAuth();
          resolve(true);
        })();
      }),
    );
    await Promise.all(promises);
    return { Error: 'Token error - will relogin' };
  };
}
