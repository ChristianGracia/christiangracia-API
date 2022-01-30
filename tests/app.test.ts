import supertest from 'supertest';
import app from '../src/app';
import Logger from '../src/config/winston';

let server;

describe('/', () => {
  beforeAll(async (done) => {
    server = app.listen(null, () => {
      global.agent = supertest.agent(server);
      Logger.info(`--------------------- url: '/' ---------------------`);
      done();
    });
    
  });

  it('GET should return 200', async () => {
    const response = await supertest(app).get('/');
    Logger.info(`--------------------- url: '/' status: ${response.status} ---------------------`);
    expect(response.status).toBe(200);
  });

  
  it('GET title is equal to ', async () => {
    const response = await supertest(app).get('/');
    
    const el = document.createElement( 'html' );
    el.innerHTML = response.text;
    
    const titleElement = el.getElementsByTagName( 'title' )[0];
    Logger.info(`--------------------- url: '/' title text: ${titleElement.textContent} ---------------------`);
    expect(titleElement.textContent).toBe('Christian Gracia API Homepage');
  });

  afterAll(async () => {
    await server.close();
  });
});