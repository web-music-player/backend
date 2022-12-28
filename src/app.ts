// Dependencies

import dotenv from 'dotenv';
import express, { Express } from 'express';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from "../swagger.json";

import autenticazione from './autenticazione';
import eliminaAccount from './eliminaAccount';
import brani from './brani';
import preferiti from './preferiti';

import { tokenChecker } from '../scripts';

dotenv.config();
const port = process.env.PORT || 8080;

// Create the app instance and add the router

const app: Express = express();

// Middleware to parse form data

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API documentation

swaggerDocument['host'] = `localhost:${port}`;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(
    swaggerDocument,
    {
        customSiteTitle: 'Documentazione',
        customCss: ''
    }
));

// Routes (including default route)

app.use('/', autenticazione);

app.use(tokenChecker);

app.use('/', eliminaAccount);
app.use('/', brani);
app.use('/', preferiti);

export default app;
