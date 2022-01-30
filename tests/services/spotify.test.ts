import app from '../../src/app';
import supertest from 'supertest';
import Logger from '../../src/config/winston';

Logger.info(`--------------------- Testing Spotify  ---------------------`);


jest.setTimeout(50000)

describe('Rendered Views Tests', () => {
    let server;
    beforeAll(async (done) => {
      server = app.listen(null, async () => {
        global.agent = supertest.agent(server);
      });
      const response = await supertest(app).get('/spotify/recently-played');
      console.log(response);
      Logger.info(`--------------------- Set up done---------------------`);
      done();
    });
  
    
    it(`GET recently played returns songs after login`, async () => {
        // setTimeout(async () => {
            const response = await supertest(app).get('/spotify/recently-played');
            console.log(response);
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
//         await spotify.getRecentlyPlayed();
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