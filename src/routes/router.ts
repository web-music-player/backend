// Dependencies

const express = require('express');
const multer = require('multer');

import { Request, Response } from 'express';

// Router and middleware

const router  = express.Router();
const upload = multer();

// Routes

router.get('', (req: Request, res: Response) => {
    res.status(200).send("Hello, world!")
});

module.exports = router;
