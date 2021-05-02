import express, { Request, Response } from 'express';
const router = express.Router();
import * as path from 'path';
import * as dotenv from 'dotenv';

import { NodeMailgun } from 'ts-mailgun';

dotenv.config();

const cgMailer = new NodeMailgun();
cgMailer.apiKey = process.env.MAILGUN_API_KEY;
cgMailer.domain = process.env.MAILGUN_DOMAIN;

cgMailer.fromEmail = 'noreply@christiangracia.com';
cgMailer.fromTitle = 'christiangracia.com';
cgMailer.init();

const nflMailer = new NodeMailgun();
nflMailer.apiKey = process.env.MAILGUN_API_KEY;
nflMailer.domain = process.env.MAILGUN_DOMAIN;

nflMailer.fromEmail = 'noreply@nflandscaping.com';
nflMailer.fromTitle = 'nflandscaping.com';



router.post('/send-email', (req: Request, res: Response) => {

  const { name, email, message } = req.body

  const emailTitle = `Email from ${name}: ${email}`;

  nflMailer
    .send('christianmgracia@gmail.com', emailTitle, `<h1>${message}</h1>`)
    .then((result) =>
      res.send({
        name: name,
        email: email,
      }),
    )
    .catch((error) => res.send(null));
});

router.post('/send-email-nfl', (req: Request, res: Response) => {

  const { name, phone, message } = req.body

  const emailTitle = `Email from ${name}: ${phone}`;

  console.log(req.body);

  nflMailer
    .send(process.env.NFL_EMAIL, emailTitle, `<h1>${message}</h1>`)
    .then((result) => {
        console.log("sent");
        res.status(204).send({});
      }
    )
    .catch((error) => res.send(null));
});

router.post('/site-visit', (req: Request, res: Response) => {

  const { zip, query, region, city, country } = req.body

  const message = `
  <h1>Data</h1>
  <h1> ${city} </h1>
  <h1> ${region} ${zip} </h1>
  <h1> ${country} </h1>
  <h1>ip: ${query} </h1>
  `;
  const emailTitle = `New visitor from ${city}, ${region}, ${zip}`;

  cgMailer
    .send('christianmgracia@gmail.com', emailTitle, `${message}`)
    .then((result) => res.send({}))
    .catch((error) => res.send(null));
});

router.get('/', (req: Request, res: Response) => {
  let reqPath = path.join(__dirname, '../../views/email.html');
  console.log(reqPath);
  res.sendFile(path.join(reqPath));
});

module.exports = router;
