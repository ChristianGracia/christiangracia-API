import express, { Request, Response } from 'express';

const router = express.Router();

import * as dotenv from 'dotenv';

router.post('/login', (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
});

module.exports = router;
