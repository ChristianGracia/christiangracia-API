import puppeteer from 'puppeteer';

export class Puppeteer {
  scraper;
  constructor() {
    this.scraper = puppeteer;
  }

  public getGithub = async () => {
    const browserOptions = {
      headless: false,
      ignoreHTTPSErrors: true,
      args: ['--window-size=1920,1080', '--no-sandbox'],
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36',
    };
    const browser = await puppeteer.launch(browserOptions);
    const page = await browser.newPage();

    await page.goto(
      'https://github.com/ChristianGracia/christiangracia-API/commit/b2be8f7ae714bc911cdea93aa46e31a26bd87bf9',
      { waitUntil: 'networkidle2' },
    );
    await page.waitForNetworkIdle();
    await page.waitForTimeout(2000);
    const pElements = await page.$$('.file');
    for (let num = 0; num < pElements.length; num++) {
      var pElementBoundingBox = await pElements[num].boundingBox();
      pElements[num].screenshot({
        path: `images/p_elem_${num + 1}.png`,
        clip: pElementBoundingBox,
      });
    }

    // let elements = await page.$$('.file');
    // console.log(elements.length);
    // const images = await elements.map(
    //   async (element, i) =>
    //     await element.screenshot({
    //       path: 'images/google' + i + '.png',
    //       //   fullPage: true,
    //     }),
    // );
    await browser.close();
    // return images[0];
    // try {
    //   //   let images = await page.evaluate(async () => {
    //   //     let data = [];
    //   //     let elements = document.getElementsByClassName('file');
    //   //     for (var element of elements)
    //   //       data.push(await element.screenshot({ path: `${i}.png` }));
    //   //     return data;
    //   //   });

    //   await browser.close();
    //   return await page.screenshot({ path: 'google.png', fullPage: true });
    // } catch {
    //   await browser.close();
    //   return [];
    // }
  };
}
