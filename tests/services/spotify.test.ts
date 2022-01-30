import { Spotify } from '../../src/classes/spotify';
import Logger from '../../src/config/winston';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const client_user = process.env.SPOTIFY_CLIENT_USER;
const client_password = process.env.SPOTIFY_CLIENT_PASSWORD;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URL;

const spotify = new Spotify(client_id, client_secret, client_user, client_password, redirect_uri);

Logger.info(`--------------------- Testing Spotify  ---------------------`);

describe('Spotify API Tests', () => {

    // beforeAll(async (done) => {
    //     await spotify.getCurrentlyPlaying();
    //     Logger.info(`--------------------- Token Received ---------------------`);
    //     done();
    // });

    it('Spotify received access token', async () => {
        await spotify.getCurrentlyPlaying();
        expect(spotify.access_token).toBeTruthy;
        Logger.info(`--------------------- ACCESS TOKEN RECEIVED ---------------------`);
    });
});