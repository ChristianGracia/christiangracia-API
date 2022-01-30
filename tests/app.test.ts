import supertest from 'supertest';
import app from '../src/app';
import Logger from '../src/config/winston';

import { htmlHelper } from './helpers/page';

const baseUrl = '/'
const pageName = 'home'

let server;
let page;
let title;

describe('/', () => {
  beforeAll(async (done) => {
    server = app.listen(null, async () => {
      global.agent = supertest.agent(server);
      Logger.info(`--------------------- url: ${baseUrl} ---------------------`);
      page = await htmlHelper.createPage(pageName);
      title = page.getElementsByTagName( 'title' )[0].textContent;
      done();
    });
    
  });

  it('GET should return 200 status', async () => {
    const response = await supertest(app).get('/');
    Logger.info(`--------------------- url: ${baseUrl} status: ${response.status} ---------------------`);
    expect(response.status).toBe(200);
  });

  
  it(`GET title is equal to ${title}`, async () => {
    const response = await supertest(app).get('/');
    const titleFound = htmlHelper.checkPageTitle(response.text);

    Logger.info(`--------------------- url: ${baseUrl} title text: ${titleFound} ---------------------`);
    expect(titleFound).toBe(title);
  });

  afterAll(async () => {
    await server.close();
  });
});s