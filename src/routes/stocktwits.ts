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
  await page.type('input[name=login]', process.env.ST_USERNAME);
  await page.type('input[name=password]', process.env.ST_PASSWORD);

  const submitButton = await page.$x(
    '//*[@id="app"]/div/div/div[4]/div[2]/div/form/div[2]/div[1]/button',
  );

  await submitButton[0].click();
  await page.waitForTimeout(2000);
  const formattedMessage = `$${ticker} ${message}`;

  const sentimentXpath = `//*[@id="app"]/div/div/div[3]/div[2]/div/div[1]/div/div/div[1]/div/div[2]/div[2]/div/div[1]/div/div[${
    positiveSentiment ? '1' : '2'
  }]`;

  const sentiment = await page.$x(sentimentXpath);
  await sentiment[0].click();

  //   message_input = self.driver.find_elements_by_xpath('//*[@id="app"]/div/div/div[3]/div/div/div[1]/div/div/div[1]/div/div[2]/div[1]/div/div/div[2]/div')[0]
  //   message_input.click()
  //   message_input.send_keys(formatted_message)

  //   submit_post_button = self.driver.find_elements_by_xpath('//*[@id="app"]/div/div/div[3]/div/div/div[1]/div/div/div[1]/div/div[3]/div[1]/button')[0]
  //   submit_post_button.click()

  // await browser.close();
});

router.get('/', (req: Request, res: Response) => {
  res.send('hi');
});

module.exports = router;
