import Logger from '../../src/config/winston';
import puppeteer from 'puppeteer';

Logger.info(`--------------------- Testing Spotify  ---------------------`);

jest.setTimeout(50000);

describe('Render Spotify End to End Tests', () => {
  let page;
  let browser;
  beforeAll(async (done) => {
    const browserOptions = {
      headless: false,
      ignoreHTTPSErrors: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
    };
    browser = await puppeteer.launch(browserOptions);

    page = await browser.newPage();
    await page.goto('http://localhost:3000/spotify/recently-played', {
      waitUntil: 'networkidle2',
    });

    Logger.info(`--------------------- Set up done---------------------`);
    done();
  });

  it(`GET recently played returns songs after spotify`, async () => {
    const data = await page.evaluate(
      () => document.querySelector('body').innerText,
    );

    const dataArray = JSON.parse(data);

    const { name, artist } = dataArray[0];
    Logger.info(
      `--------------------- Last song - ${name} by ${artist} ---------------------`,
    );

    expect(dataArray.length).toBeTruthy;
    expect(dataArray[0]).toBeTruthy;
    expect(artist).toBeTruthy;
    expect(name).toBeTruthy;
  });

  afterAll(async () => {
    await browser.close();
    Logger.info(
      `--------------------- Finished Testing puppeteer ---------------------`,
    );
  });
});
