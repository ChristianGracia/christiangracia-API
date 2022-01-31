import app from '../../src/app';
import supertest from 'supertest';
import Logger from '../../src/config/winston';
import { Spotify } from '../../src/classes/spotify';

Logger.info(`--------------------- Testing Spotify  ---------------------`);

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const client_user = process.env.SPOTIFY_CLIENT_USER;
const client_password = process.env.SPOTIFY_CLIENT_PASSWORD;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URL;


jest.setTimeout(30000)

describe('Render Spotify data Tests', () => {
    let server;
    let response;
    beforeAll(async (done) => {
      server = app.listen(null, async () => {
        global.agent = supertest.agent(server);
      });
      response = await supertest(app).get('/spotify/currently-playing');
      // setTimeout(() =>  {
        Logger.info(`--------------------- Set up done---------------------`);
        done();
      // }, 15000)
    });
  
    
    it(`GET recently played returns songs after login`, async () => {
      console.log(response);
        // setTimeout(async () => {
            // const response = await supertest(app).get('/spotify/recently-played');
            // console.log(response);
        // }, 10000)
    });



  
    afterAll(async () => {
      await server.close();
      Logger.info(`--------------------- Finished Testing puppeteer ---------------------`);
    });
  });



// describe('Spotify API Tests', () => {
//     let spotify;

//     beforeAll(async (done) => {
//         spotify = new Spotify(client_id, client_secret, client_user, client_password, redirect_uri);
//         const response = await spotify.getCurrentlyPlaying();
//         console.log(response);
//         // setTimeout(() => expect(spotify.access_token).toBeTruthy, 30000)
//         Logger.info(`--------------------- Token Received ---------------------`);
//         done();
//     });

//     it('Spotify received access token', async () => {
//         console.log(spotify.access_token);
//         expect(spotify.access_token).toBeTruthy;
//         Logger.info(`--------------------- ACCESS TOKEN RECEIVED ---------------------`);
//         // spotify.getCurrentlyPlaying();
//         // setTimeout(() => {
//         //     expect(spotify.access_token).toBeTruthy
//         //     console.log('token')
//         //     console.log(spotify.access_token)
//         //     Logger.info(`--------------------- Token Received ---------------------`);
//         // }, 30000)
//     });
// });