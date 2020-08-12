import express, { Request, Response } from "express";
const router = express.Router();

import * as dotenv from "dotenv";

import { NodeMailgun } from "ts-mailgun";

const mailer = new NodeMailgun();
mailer.apiKey = process.env.MAILGUN_API_KEY;
mailer.domain = process.env.MAILGUN_DOMAIN;
mailer.fromEmail = "noreply@christiangracia.com";
mailer.fromTitle = "New email from christiangracia.com";
mailer.init();

dotenv.config();

router.post("/send-email", (req: Request, res: Response) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  const emailTitle = `${name}: ${email} | christiangracia.com`;

  mailer
    .send("christianmgracia@gmail.com", emailTitle, `<h1>${message}</h1>`)
    .then((result) =>
      res.send({
        name: name,
        email: email,
      })
    )
    .catch((error) => res.send(null));
  // });
});

module.exports = router;
