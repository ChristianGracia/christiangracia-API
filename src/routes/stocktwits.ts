import express, { Request, Response } from 'express';
import puppeteer from 'puppeteer';

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

  await page.goto('https://www.stocktwits.com', {
    // waitUntil: 'networkidle0',
  });

  const loginButton = await page.$x(
    '//*[@id="app"]/div/div/div[2]/div/div/div/div/div[1]/div[1]/div[3]/div[2]/span',
  );

  await loginButton[0].click();

  // Enter login credentials
  await page.$eval(
    'input[name=login]',
    (el: any, value) => (el.value = value),
    'dhdhdhd',
  );

  await page.$eval(
    'input[name=password]',
    (el: any, value) => (el.value = value),
    'dhdhedhedh',
  );

  const submitButton = await page.$x(
    '//*[@id="app"]/div/div/div[4]/div[2]/div/form/div[2]/div[1]/button',
  );

  await submitButton[0].click();

  // await browser.close();
});

router.get('/', (req: Request, res: Response) => {
  res.send('hi');
});

module.exports = router;
