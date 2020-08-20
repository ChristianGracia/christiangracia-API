import express, { Request, Response } from "express";
const router = express.Router();

import * as dotenv from "dotenv";

import { NodeMailgun } from "ts-mailgun";

const mailer = new NodeMailgun();
mailer.apiKey = process.env.MAILGUN_API_KEY;
mailer.domain = process.env.MAILGUN_DOMAIN;
mailer.fromEmail = "noreply@christiangracia.com";
mailer.fromTitle = "christiangracia.com";
mailer.init();

dotenv.config();

router.post("/send-email", (req: Request, res: Response) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  const emailTitle = `Email from ${name}: ${email}`;

  mailer
    .send("christianmgracia@gmail.com", emailTitle, `<h1>${message}</h1>`)
    .then((result) =>
      res.send({
        name: name,
        email: email,
      })
    )
    .catch((error) => res.send(null));
});

router.post("/site-visit", (req: Request, res: Response) => {
  const emailTitle = `New visitor on christiangracia.com`;

  const body = req.body;

  const city = body.city;
  const country = body.country;

  const zip = body.zip;
  const query = body.query;
  const region = body.region;
  const regionName = body.regionName;

  const message = `
  <h1>Data</h1>
  <h1> ${city} </h1>
  <h1> ${regionName}, ${region} ${zip} </h1>
  <h1> ${country} </h1>
  <h1>ip: ${query} </h1>
  `;

  mailer
    .send("christianmgracia@gmail.com", emailTitle, `${message}`)
    .then((result) => res.send({}))
    .catch((error) => res.send(null));
});

module.exports = router;
