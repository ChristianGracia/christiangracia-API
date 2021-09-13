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
  };
  const browser = await puppeteer.launch(browserOptions);
  const page = await browser.newPage();
  page.goto('https://www.stocktwits.com');
});

router.get('/', (req: Request, res: Response) => {
  res.send('hi');
});

module.exports = router;
