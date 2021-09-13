import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {});

router.get('/', (req: Request, res: Response) => {
  res.send('hi');
});

module.exports = router;
