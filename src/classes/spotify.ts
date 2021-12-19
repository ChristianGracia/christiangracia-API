const axios = require('axios');
import puppeteer from 'puppeteer';
import querystring from 'querystring';

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
        console.log(`Access Token Set | method: ${method} XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
        if (method === 'auth_code_flow') {
            this.puppeteerSuccess = true;
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
            return {'Error': 'Bot already running'};
        } else {
            this.puppeteerRunning = true;
        }
        try {
            const promises = [];
            promises.push(
                new Promise(resolve => {
                    (async () => {
                        console.log('puppeteer incoming xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                        const state = 'dkedkekdekdked';
                        const scope = 'user-read-private user-read-email user-read-currently-playing user-read-recently-played';
                        const browserOptions = {
                            headless: false,
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
                                client_id: this.client_id,
                                scope: scope,
                                redirect_uri: this.redirect_uri,
                                state: state,
                                }),
                            );
                            await page.waitForTimeout(2000);
                            await page.type('input[name=username]', this.client_user);
                            await page.type('input[name=password]', this.client_password);
                        
                            const submitButton = await page.$x('//*[@id="login-button"]');
                            await page.waitForTimeout(1000);
                            await submitButton[0].click();
                            await page.waitForTimeout(1000);
                        
                        //   const songData = await page.evaluate(() => {
                        //     return JSON.parse(document.querySelector('body').innerText);
                        //   });
                        await browser.close();
                        } catch {
                            await browser.close();
                        }
                        resolve(true);
                    })();
                })
            );
            await Promise.all(promises);

            this.puppeteerRunning = false;
            let counter = 0;
            var interval = setInterval(() => {
                if (this.puppeteerSuccess || counter > 5) {
                    clearInterval(interval);
                }
                counter = counter + 1;
            }, 1000);

            return {
                'access_token': this.access_token,
                'email_sent': await this.sendEmail('puppeteer script'),
            };
        } catch (err) {
            this.puppeteerRunning = false;
            return {};
        }
    }

    useAuthCodeToken = async (code) => {
        if (!code) {
            console.log('Puppeteer Login Auth Code flow not ran');
            return {'Error': 'Puppeteer Login Auth Code flow not ran'};
        }
        try {
            const data = {
                code: code,
                redirect_uri: this.redirect_uri,
                grant_type: 'authorization_code',
            }

            console.log('xxxxxxxxxxxxxxx    Getting Token  xxxxxxxxxxxxxxxxxx');
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
                    const { access_token,  refresh_token } = response.data;
                    this.setAccessToken(access_token, 'auth_code_flow')
                    this.setRefreshToken(refresh_token)
                    return { auth: true}
                } else {
                    return {'Error': 'Error retrieving token '}; 
                }    
            })
            .catch((error) => {
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
            console.log(`${jobType} email sent XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
            return res.data;
        } else {
            return {'Error': 'Error sending email '}; 
        }
    }
}