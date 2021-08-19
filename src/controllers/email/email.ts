import express, { Request, Response } from 'express';
const router = express.Router();
import * as path from 'path';

import { NodeMailgun } from 'ts-mailgun';
import { createCgEmail, createNflEmail } from '../../services/email-service';

const { MAILGUN_API_KEY, MAILGUN_DOMAIN, CG_EMAIL, NFL_EMAIL } = process.env;

// init mailer for christiangracia.com
const cgMailer = new NodeMailgun();
cgMailer.apiKey = MAILGUN_API_KEY;
cgMailer.domain = MAILGUN_DOMAIN;
cgMailer.fromEmail = 'noreply@christiangracia.com';
cgMailer.fromTitle = 'christiangracia.com';
cgMailer.init();

// init mailer for nflandscaping.com
const nflMailer = new NodeMailgun();
nflMailer.apiKey = MAILGUN_API_KEY;
nflMailer.domain = MAILGUN_DOMAIN;
nflMailer.fromEmail = 'noreply@nflandscaping.com';
nflMailer.fromTitle = 'nflandscaping.com';
nflMailer.init();

router.post('/send-email', (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  const emailTitle = `Email from ${name}: ${email}`;

  cgMailer
    .send(CG_EMAIL, emailTitle, createCgEmail(name, email, message))
    .then(() => res.status(204).send({}))
    .catch((error) => res.status(500).send(error));
});

router.post('/send-email-nfl', (req: Request, res: Response) => {
  const { name, phone, message } = req.body;

  const emailTitle = `Email from ${name}: ${phone}`;

  nflMailer
    .send(NFL_EMAIL, emailTitle, createNflEmail(name, phone, message))
    .then(() => {
      res.status(204).send({});
    })
    .catch((error) => res.status(500).send(error));
});

router.post('/site-visit', (req: Request, res: Response) => {
  const { zip, query, region, city, country } = req.body;

  const message = `
  <h1>Data</h1>
  <h1> ${city} </h1>
  <h1> ${region} ${zip} </h1>
  <h1> ${country} </h1>
  <h1>ip: ${query} </h1>
  `;
  const emailTitle = `New visitor from ${city}, ${region}, ${zip}`;

  cgMailer
    .send(CG_EMAIL, emailTitle, message)
    .then(() => res.status(204).send({}))
    .catch(() => res.status(500).send(null));
});

router.get('/', (req: Request, res: Response) => {
  const reqPath = path.join(__dirname, '../../views/email.html');
  res.sendFile(path.join(reqPath));
});

module.exports = router;
