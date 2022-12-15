// Dependencies

const express = require('express');
const multer = require('multer');

import { Request, Response } from 'express';

// Router and middleware

const router  = express.Router();
const upload = multer();

module.exports = router;
