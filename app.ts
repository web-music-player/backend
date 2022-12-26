// Dependencies

import dotenv from 'dotenv';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from "./swagger.json";

dotenv.config();

// Create the app instance and add the router

const app: Express = express();

// Middleware to parse form data

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

import routes from './routes/router';
app.use('/', routes);

// Set connection values

const port = process.env.PORT || 8080;
const mongodb_uri = process.env.MONGODB_URI || "";

// Connect to the database and start the server

mongoose.set('strictQuery', true);
mongoose.connect(mongodb_uri)
    .then(() => {

        console.log("Connected to Database");

        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });

    })
    .catch(() => {
        console.error("Could not connect to the Database")
    });

// API documentation

swaggerDocument['host'] = `localhost:${port}`;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(
    swaggerDocument,
    {
        customSiteTitle: 'Documentazione',
        customCss: ''
    }
));