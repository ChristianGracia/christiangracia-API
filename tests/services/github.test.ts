import Logger from '../../src/config/winston';
import puppeteer from 'puppeteer';

Logger.info(`--------------------- Github  ---------------------`);

describe('Render Github routes End to End Tests', () => {
    let page;
    let browser;
    beforeAll(async (done) => {
        const browserOptions = {
            headless: false,
            ignoreHTTPSErrors: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
        };
        browser = await puppeteer.launch(browserOptions);
    
        page = await browser.newPage();
        await page.goto('http://localhost:3000/github/all-repos', {waitUntil: 'networkidle2'});

        Logger.info(`--------------------- Set up done---------------------`);
        done();
    });
  
    
    it(`GET all repos`, async () => {
      const data = await page.evaluate(() => document.querySelector('body').innerText);
      
      const dataArray = JSON.parse(data);
      expect(dataArray.length).toBeTruthy;
      expect(dataArray[0]).toBeTruthy;

      const { url, name, description, language, updatedAt} = dataArray[0];

      Logger.info(`--------------------- First repo - ${name} - ${language} ---------------------`);
      expect(url).toBeTruthy;
      expect(name).toBeTruthy;
      expect(description).toBeTruthy;
      expect(updatedAt).toBeTruthy;
    });

    it(`GET all commits of repo`, async () => {
        await page.goto('http://localhost:3000/github/repo-all-commits?repoName=christiangracia.com3.0&numberOfCommits=250', {waitUntil: 'networkidle2'});
        const data = await page.evaluate(() => document.querySelector('body').innerText);
        
        const dataArray = JSON.parse(data);
        expect(dataArray.length).toBeTruthy;
        expect(dataArray[0]).toBeTruthy;
  
        const { message } = dataArray[0];
  
        Logger.info(`--------------------- First commit - ${message} ---------------------`);
        expect(message).toBeTruthy;
    });
  
    afterAll(async () => {
      await browser.close();
      Logger.info(`--------------------- Finished Testing Github ---------------------`);
    });
  });