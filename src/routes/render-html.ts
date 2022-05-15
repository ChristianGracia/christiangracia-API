import express, { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { utilService } from '../services/util-service';
const router = express.Router();

router.get(
  '/christian-gracia-spotify-player',
  (req: Request, res: Response) => {
    res.status(200).send('');
  },
);

router.get('/icons', async (req: Request, res: Response) => {
  const production = process.env.NODE_ENV === 'production' ? 'build/' : '';
  // const cssCode = await utilService.readFile(
  //   `${production}src/assets/css/materialdesignicons.css`,
  // );
  // res.writeHead(200, { 'Content-Type': 'text/css' });
  // res.write(cssCode);
  res.end();
});

module.exports = router;
