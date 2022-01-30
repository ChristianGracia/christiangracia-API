import supertest from 'supertest';
import app from '../../src/app';
import Logger from '../../src/config/winston';

import { htmlHelper } from '../helpers/page';
import { Constants } from '../constants';
import { Page } from "../types";

const FOOTER_TEXT = Constants.FOOTER_TEXT;

const pages : Page[] = Constants.PAGES;

Logger.info(`--------------------- Testing all pages  ---------------------`);

let server;
pages.forEach((page: Page) => {
  let html;
  let title;

  describe('/', () => {
    beforeAll(async (done) => {
      server = app.listen(null, async () => {
        global.agent = supertest.agent(server);
      });
      html = await htmlHelper.createPage(page.pageName);
      title = html.getElementsByTagName( 'title' )[0].textContent;
      Logger.info(`--------------------- Testing url: ${page.baseUrl} ---------------------`);
      done();
    });
  
    it('GET should return 200 status', async () => {
      const response = await supertest(app).get(page.baseUrl);
      Logger.info(`--------------------- status: ${response.status} ---------------------`);
      expect(response.status).toBe(200);
    });
  
    
    it(`GET rendered Title is equal to file on server's title`, async () => {
      const response = await supertest(app).get(page.baseUrl);
      const titleFound = htmlHelper.getHTmlElements(response.text, 'title')[0].textContent;
      Logger.info(`--------------------- rendered title: ${titleFound} | title on server: ${title} ---------------------`);
      expect(titleFound).toBe(title);
      expect(titleFound + "1").not.toBe(title);
    });

    it("Get footer equals to what is expected", async () => {
      const response = await supertest(app).get(page.baseUrl);

      Logger.info(`--------------------- bottom text located ---------------------`);
      expect(response.text.indexOf(FOOTER_TEXT)).toBeTruthy
    });
  
    afterAll(async () => {
      await server.close();
      Logger.info(`--------------------- Finished Testing ${page.baseUrl} ---------------------`);
    });
  });
});