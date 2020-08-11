import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';

const app = express();

// import * as apiController from './controllers/api';

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', (req, res) => {
  res.send('<h1>Welcome to my API back-end</h1>');
});

app.use('/api', (req, res) => {
  res.send('<h1>/API</h1>');
});

// app.get('/api', apiController.getApi);

export default app;
