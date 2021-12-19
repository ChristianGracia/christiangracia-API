const axios = require('axios');
import puppeteer from 'puppeteer';
import querystring from 'querystring';
import Logger from '../config/winston';

export class Spotify {
    public access_token: string = '';
    public refresh_token: string = '';
    public client_id: string = '';
    public client_secret: string = '';
    public client_password: string = '';
    public redirect_uri: string = '';
    public client_user: string = '';
    public puppeteerRunning: boolean = false;
    public puppeteerSuccess: boolean = false;

    constructor(client_id, client_secret, client_user, client_password, redirect_uri) {
        this.client_id = client_id
        this.client_secret = client_secret
        this.client_user = client_user
        this.client_password = client_password
        this.redirect_uri = redirect_uri
    }

    private setAccessToken(token, method = ''){
        this.access_token = token
        if (method === 'auth_code_flow') {
            Logger.info(`---------------------Access Token Set | method: ${method}---------------------`);
            this.puppeteerSuccess = true;
        } else if (method === 'refresh_token') {
            Logger.info('---------------------Token refreshed ---------------------');
        }
    }
    private setRefreshToken(token){
        this.refresh_token = token
    }

    puppeteerLogInAuth = async () => {
        if (!this.client_id || !this. client_secret) {
            return {'Error': 'Missing client id or client secret'};
        }
        if (this.puppeteerRunning) {
            console.log('zzzzzzzzzzzzzzzzzzzzzzzz Bot already running zzzzzzzzzzzzzzzzzzzzzz')
            return {'Error': 'Bot already running'};
        } else {
            this.puppeteerRunning = true;
        }
        try {
            const promises = [];
            const startTime = new Date().getTime();
            promises.push(
                new Promise(resolve => {
                    (async () => {
                        Logger.info('---------------------puppeteer starting---------------------');
                        const state = 'dkedkekdekdked';
                        const scope = 'user-read-private user-read-email user-read-currently-playing user-read-recently-played';
                        const browserOptions = {
                            headless: true,
                            ignoreHTTPSErrors: true,
                            args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
                                client_id: this.client_id,
                                scope: scope,
                                redirect_uri: this.redirect_uri,
                                state: state,
                                }),
                            );
                            Logger.info(`--------------------- page start ${(new Date().getTime() - startTime) / 1000}}---------------------`);
                            await page.waitForSelector('input[name=username]')
                            Logger.info(`--------------------- username start ${(new Date().getTime() - startTime) / 1000}}---------------------`);
                            await page.type('input[name=username]', this.client_user);
                            Logger.info(`--------------------- username done ${(new Date().getTime() - startTime) / 1000}}---------------------`);
                            await page.waitForSelector('input[name=password]')
                            Logger.info(`--------------------- password start ${(new Date().getTime() - startTime) / 1000}}---------------------`);
                            await page.type('input[name=password]', this.client_password);
                            Logger.info(`--------------------- password done ${(new Date().getTime() - startTime) / 1000}}---------------------`);
                            Logger.info(`--------------------- inputs done ${(new Date().getTime() - startTime) / 1000}}---------------------`);
                            const submitButton = await page.$x('//*[@id="login-button"]');
                            Logger.info(`--------------------- login found ${(new Date().getTime() - startTime) / 1000}}---------------------`);
                            await page.waitForTimeout(3000);
                            Logger.info(`--------------------- login clicked done ${(new Date().getTime() - startTime) / 1000}}---------------------`);
                            await submitButton[0].click();
                            Logger.info(`--------------------- login done ${(new Date().getTime() - startTime) / 1000}}---------------------`);
                            await page.waitForXPath('//*[contains(text(), "token")]');
                            Logger.info(`--------------------- ${(new Date().getTime() - startTime) / 1000}}---------------------`);
                            await browser.close();
                            Logger.info('---------------------puppeteer closed---------------------');
                            Logger.info(`--------------------- ${(new Date().getTime() - startTime) / 1000}}---------------------`);
                        } catch {
                            Logger.error('--------------------- puppeteer error ---------------------');
                            await browser.close();
                        }
                        resolve(true);
                    })();
                })
            );
            await Promise.all(promises);

            this.puppeteerRunning = false;
            this.setRefreshTokenInterval();
            Logger.info(`--------------------- promises done ${(new Date().getTime() - startTime) / 1000}}---------------------`);
            return {
                'access_token': this.access_token,
                'email_sent': await this.sendEmail('puppeteer script'),
            };
        } catch (err) {
            this.puppeteerRunning = false;
            Logger.error('--------------------- puppeteer error ---------------------');
            return {};
        }
    }

    useAuthCodeToken = async (code) => {
        const startTime = new Date().getTime();
        Logger.info('---------------------Getting token with code---------------------');
        if (!code) {
            Logger.error('---------------------Puppeteer Login Auth Code flow not ran---------------------');
            return {'Error': 'Puppeteer Login Auth Code flow not ran'};
        }
        try {
            Logger.info('--------------------- Using auth code ---------------------');
            const data = {
                code: code,
                redirect_uri: this.redirect_uri,
                grant_type: 'authorization_code',
            }
            return axios({
                url: 'https://accounts.spotify.com/api/token',
                method: 'post',
                params: data,
                headers: {
                    Authorization:
                    'Basic ' +
                    new Buffer(this.client_id + ':' + this.client_secret).toString('base64'),
                    'Accept':'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    Logger.info(`--------------------- Access token set ${(new Date().getTime() - startTime) / 1000}}---------------------`);
                    const { access_token,  refresh_token } = response.data;
                    this.setAccessToken(access_token, 'auth_code_flow')
                    this.setRefreshToken(refresh_token)
                    return { auth: true }
                } else {
                    Logger.error('--------------------- auth code error in token generation ---------------------');
                    return {'Error': 'Error retrieving token '}; 
                }    
            })
            .catch((error) => {
                Logger.error('--------------------- auth code error in token generation ---------------------');
                return { error }
            });
        } catch (err) {
            return {'Error': 'Error retrieving token using authorization code'}; 
        }
    }
    sendEmail = async (jobType) => {
        const body = {
              jobType: `${jobType}`,
              message: `${jobType} ran`
          };

        const res = await axios({
                url: 'https://christiangracia-api.herokuapp.com/email/job-ran',
                method: 'post',
                params: body,
        });
        if (res.status === 200) {
            console.warn(`--------------------------- ${jobType} email sent ---------------------------`)
            return res.data;
        } else {
            return {'Error': 'Error sending email '}; 
        }
    }
    getCurrentlyPlaying = async () => {
        if (this.access_token === '') {
            console.log('server started, no token found');
            await this.handleTokenError();
        }

        return await axios({
            url: 'https://api.spotify.com/v1/me/player/currently-playing',
            method: 'get',
            headers: {
                Authorization: 'Bearer ' + this.access_token,
                'Accept':'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
    }
    getRecentlyPlayed  = async () => { 
        if (this.access_token === '') {
            console.log('server started, no token found');
            await this.handleTokenError();
        }

        return await axios({
            url: 'https://api.spotify.com/v1/me/player/recently-played?limit=50',
            method: 'get',
            headers: {
                Authorization: 'Bearer ' + this.access_token,
                'Accept':'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
    }

    refreshToken = async () => {
        if (!this.refreshToken) {
            return {'Error': 'Missing refresh token'};
        }

        const data = {
            grant_type: 'refresh_token',
            refresh_token: this.refresh_token,
        };

        return axios({
            url: 'https://accounts.spotify.com/api/token',
            method: 'post',
            params: data,
            headers: {
                Authorization:
                'Basic ' +
                new Buffer(this.client_id + ':' + this.client_secret).toString('base64'),
                'Accept':'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
        .then(async (response) => {
            if (response.status === 200) {
                const { access_token, } = response.data;
                console.log(response.data);
                this.setAccessToken(access_token, 'refresh_token');
                this.setRefreshTokenInterval();
                return { auth: true, 'email_sent': await this.sendEmail('refresh token')}
            } else {
                await this.handleTokenError();
                return {};
            }    
        })
        .catch(async (error) => {
            await this.handleTokenError();
            return { error }
        });
    }

    setRefreshTokenInterval = async () => {
        setTimeout(() => {
            this.access_token = '';
            this.refreshToken();
        }, 60 * 1000 * 30)
    }
    handleTokenError = async () => {
        Logger.error('---------------------RESETTING TOKEN ---------------------');
        this.access_token = '';
        const promises = [];
        promises.push(
            new Promise(resolve => {
                (async () => {
                    await this.puppeteerLogInAuth()
                    resolve(true);
                })();
            })
        );
        await Promise.all(promises);
        return {'Error': 'Token error - will relogin'}; 
    }
}
