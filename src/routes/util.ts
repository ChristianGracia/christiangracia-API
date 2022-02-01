import express, { Request, Response } from 'express';
import { utilService } from '../services/util-service';

const router = express.Router();

router.get('/show-file', async (req: Request, res: Response) => {
  const { file, cssFile } = req.query;
  console.log(file);
  if (!file) {
      res.status(400).send('File to be viewed is required')
  }
  const response = await utilService.parseCodeFileToHtml(
    req.query.file.toString(),
    req.query.cssFile.toString(),
  )

  if (response.status === 200) {
    res.setHeader('content-type', 'text/html');
  }
  res.status(response.status).send(response.data);
});

module.exports = router;
