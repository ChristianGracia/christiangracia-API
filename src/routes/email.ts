import express, { Request, Response } from 'express';
const router = express.Router();

import { NodeMailgun } from 'ts-mailgun';
import { emailService } from '../services/email-service';

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
    .send(
      CG_EMAIL,
      emailTitle,
      emailService.createCgEmail(name, email, message),
    )
    .then(() => res.status(200).send({ name }))
    .catch((error) => res.status(500).send(error));
});

router.post('/send-email-nfl', (req: Request, res: Response) => {
  const { name, phone, message } = req.body;

  const emailTitle = `Email from ${name}: ${phone}`;

  nflMailer
    .send(
      NFL_EMAIL,
      emailTitle,
      emailService.createNflEmail(name, phone, message),
    )
    .then(() => res.sendStatus(204))
    .catch((error) => res.status(500).send(error));
});

router.post('/site-visit', (req: Request, res: Response) => {
  const { zip, query, region, city, country } = req.body;

  const emailTitle = `New visitor from ${city}, ${region}, ${zip}`;

  cgMailer
    .send(
      CG_EMAIL,
      emailTitle,
      emailService.createSiteVisitEmail(city, region, zip, country, query),
    )
    .then(() => res.sendStatus(204))
    .catch(() => res.status(500).send(null));
});

router.post('/job-ran', (req: Request, res: Response) => {
  const { jobType, message } = req.body;
  const emailTitle = `christiangracia.com - Job | ${jobType} | ${new Date().toISOString()}`;
  cgMailer
    .send(
      CG_EMAIL,
      emailTitle,
      emailService.createCgEmail(emailTitle, jobType, message),
    )
    .then(() => res.status(200).send({ 'job-ran': true, 'job-type': jobType }))
    .catch((error) => res.status(500).send(error));
});

module.exports = router;
