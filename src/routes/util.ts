import express, { Request, Response } from 'express';
const utilService = require('../services/util-service');


const router = express.Router();

router.get('/show-file/:id&:pending', (req: Request, res: Response) => {
    console.log(req.params);
    const response = utilService.parseCodeFileToHtml('src/classes/spotify.ts', );
    res.setHeader('content-type', 'text/html');
    res.status(200).send(response);
});


module.exports = router;