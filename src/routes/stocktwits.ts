import express, { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import { emailService } from '../services/email-service';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { ticker, positiveSentiment, randomization } = req.body;
  let { message } = req.body;

  //Add random repeating character to post to avoid 60 min duplicate post limit
  if (randomization) {
    const currentTime = new Date();

    const randomInt = currentTime.getMinutes() + currentTime.getSeconds();
    message += '!'.repeat(randomInt);
    console.log(message);
  }

  const browserOptions = {
    headless: false,
    ignoreHTTPSErrors: true,
    args: ['--no-sandbox'],
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36',
    defaultViewport: {
      width: 1600,
      height: 1000,
    },
  };
  const browser = await puppeteer.launch(browserOptions);
  const page = await browser.newPage();

  await page.goto('https://www.stocktwits.com');

  const loginButton = await page.$x(
    '//*[@id="app"]/div/div/div[2]/div/div/div/div/div[1]/div[1]/div[3]/div[2]/span',
  );
  await loginButton[0].click();

  await page.type('input[name=login]', process.env.ST_USERNAME);
  await page.type('input[name=password]', process.env.ST_PASSWORD);

  const submitButton = await page.$x(
    '//*[@id="app"]/div/div/div[4]/div[2]/div/form/div[2]/div[1]/button',
  );
  await submitButton[0].click();

  await page.waitForTimeout(1000);

  const formattedMessage = `$${ticker} ${message}`;

  const sentimentXpath = `//*[@id="app"]/div/div/div[3]/div[2]/div/div[1]/div/div/div[1]/div/div[2]/div[2]/div/div[1]/div/div[${
    positiveSentiment ? '1' : '2'
  }]`;
  const sentiment = await page.$x(sentimentXpath);
  await sentiment[0].click();

  const messageInput = await page.$x(
    '//*[@id="app"]/div/div/div[3]/div/div/div[1]/div/div/div[1]/div/div[2]/div[1]/div/div/div[2]/div',
  );
  await messageInput[0].click();
  await page.keyboard.type(formattedMessage);

  const postButton = await page.$x(
    '//*[@id="app"]/div/div/div[3]/div[2]/div/div[1]/div/div/div[1]/div/div[3]/div[1]/button',
  );
  await postButton[0].click();

  await browser.close();

  return {};
  // return new StocktwitsReponse();
});

router.get('/', (req: Request, res: Response) => {
  res.send('hi');
});

router.get('/create-new-email', async (req: Request, res: Response) => {
  const browserOptions = {
    headless: false,
    ignoreHTTPSErrors: true,
    args: ['--no-sandbox'],
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36',
    // defaultViewport: {
    //   width: 1600,
    //   height: 1000,
    // },
  };
  const browser = await puppeteer.launch(browserOptions);
  const page = await browser.newPage();

  await page.goto('https://account.protonmail.com/signup?language=en');
  const frame = await page
    .frames()
    .find(
      (frame) =>
        frame.url() ===
        'https://account-api.protonmail.com/challenge/v4/html?Type=0&Name=username',
    );
  await frame.$eval(
    '#username',
    (el: HTMLInputElement) => (el.value = 'test@example.com'),
  );
  await frame.$eval(
    '#password',
    (el: HTMLInputElement) => (el.value = 'dogdogdog1212'),
  );
  await frame.$eval(
    '#repeat-password',
    (el: HTMLInputElement) => (el.value = 'dogdogdog1212'),
  );

  return {};
});

module.exports = router;
