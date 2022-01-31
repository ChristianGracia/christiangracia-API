import express, { Request, Response } from 'express';
import { utilService } from '../services/util-service';


const router = express.Router();

router.get('/show-file', async (req: Request, res: Response) => {
    // console.log(req.query)
    // const { file, cssFile } = req.query;
    // if (!file) {
    //     res.status(400).send('File to be viewed is required')
    // }
    res.setHeader('content-type', 'text/html');
    res.status(200).send(await utilService.parseCodeFileToHtml(req.query.file.toString(), req.query.cssFile.toString()));
});


module.exports = router;