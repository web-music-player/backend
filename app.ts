// Dependencies

import dotenv from 'dotenv';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from "./swagger.json";

import autenticazione from './routes/autenticazione';
import eliminaAccount from './routes/eliminaAccount';
import brani from './routes/brani';
import preferiti from './routes/preferiti';

import tokenChecker from './tokenChecker';

dotenv.config();

// Set connection values

const port = process.env.PORT || 8080;
const mongodb_uri = process.env.MONGODB_URI || "";

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

app.use((req, res) => {
    res.status(404).json({ error: 'Risorsa non trovata' })
});

// Connect to the database and start the server

mongoose.set('strictQuery', true);

mongoose.connect(mongodb_uri, (err) => {
        if (err) {
            console.error("Could not connect to the Database");
            return;
        }
        console.log("Connected to Database");
        
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    }
);    
