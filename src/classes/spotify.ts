const axios = require('axios');
import puppeteer from 'puppeteer';
import querystring from 'querystring';

export class Spotify {
    access_token: string = '';
    refresh_token: string = '';
    client_id: string = '';
    client_secret: string = '';
    client_password: string = '';
    redirect_uri: string = '';
    client_user: string = '';
    public puppeteerLogInRan: boolean = false;
    public puppeteerRunning: boolean = false;

    constructor(client_id, client_secret, client_user, client_password, redirect_uri) {
        this.client_id = client_id
        this.client_secret = client_secret
        this.client_user = client_user
        this.client_password = client_password
        this.redirect_uri = redirect_uri
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
                              this.puppeteerLogInRan = true;
                              console.log('puppetter ran is now true')
                            
                            //   const emailOptions = {
                            //     url: 'https://christiangracia-api.herokuapp.com/email/job-ran',
                            //     body: {
                            //       jobType: 'puppeteer script',
                            //       message: 'puppeteer script ran',
                            //     },
                            //   };
                            
                            //   axios.post(emailOptions, function (error, response, body) {
                            //     console.error('error:', error);
                            //     console.log('statusCode:', response && response.statusCode);
                            //     console.log('body:', body);
                            //   });

                            // await axios.post('https://christiangracia-api.herokuapp.com/email/job-ran', emailOptions);
                            //   if (res.status === 200) {
                            //       console.log(res);
                            //       return res;
                            //   } else {
                            //       console.log(res);
                            //       return {'Error': 'Error retrieving token '}; 
                            //   }
                            // console.log('email sent');
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
            console.log('promsies ran')
            return true;

        } catch (err) {
            return true;
        }
    }

    useAuthCodeToken = async (code) => {
        console.log('hiiii')
        if (!this.puppeteerLogInRan) {
            console.log('error');
            return {'Error': 'Puppeteer Login Auth Code flow not ran'};
        }
        try {
            console.log('in try');
            const authOptions = {
                data: {
                  code: code,
                  redirect_uri: this.redirect_uri,
                  grant_type: 'authorization_code',
                },
                headers: {
                  Authorization:
                    'Basic ' +
                    new Buffer(this.client_id + ':' + this.client_secret).toString('base64'),
                },
                json: true,
            };

            console.log('\x1B[31mHello\x1B[34m World');
            const res = await axios.post('https://accounts.spotify.com/api/token', authOptions);
            if (res.status === 200) {
                console.log(res);
                console.log('suiccess')
                return res;
            } else {
                console.log(res);
                console.log('fail')
                return {'Error': 'Error retrieving token '}; 
            }
        } catch (err) {
            console.log(err);
            console.log('fail2')
            return err
            // return {'Error': 'Error retrieving token using authorization code'}; 
        }
}
    //   await axios.post(authOptions, function (error, response, body) {
    //         if (!error && response.statusCode === 200) {
    //             this.access_token = body.access_token;
    //             this.refresh_token = body.refresh_token;
    //             console.log('access_token set')
    //             console.log('refresh_token set')
    //             console.log('\x1b[36m Hello \x1b[34m Colored \x1b[35m World!');
    //             console.log('\x1B[31mHello\x1B[34m World');
    //             console.log('\x1b[43mHighlighted');
    //             return true;
    //         }
    //     })
}
        // try {
        //     const authOptions = {
        //         url: 'https://accounts.spotify.com/api/token',
        //         body: {
        //           code: code,
        //           redirect_uri: this.redirect_uri,
        //           grant_type: 'authorization_code',
        //         },
        //         headers: {
        //           Authorization:
        //             'Basic ' +
        //             new Buffer(this.client_id + ':' + this.client_secret).toString('base64'),
        //         },
        //         json: true,
        //       };
          
        //     const res = await axios.get('', { headers: {}});
        //     if (res.status === 200) {
        //         console.log(res)
        //         return true;
        //     }

        //     const promises = [];

       
            // promises.push(
            //     new Promise(resolve => {
            //         (async () => {
            //             try {
            //                 const { status, data } = await axios.get('', { headers: {}});
            //                 if (status === 200) {
            //                 } else {
            //                 }
            //                 resolve(true);
            //             } catch (err) {
            //                 resolve(true);
            //             }
            //         })();
            //     })
            // );
            // await Promise.all(promises);
            // return true;
