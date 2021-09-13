import express, { Request, Response } from 'express';
import puppeteer from 'puppeteer';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
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
