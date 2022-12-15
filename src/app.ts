// Dependencies

import dotenv from 'dotenv';
import express, { Express } from 'express';
import mongoose from 'mongoose';

dotenv.config();

// Create the app instance and add the router

const app: Express = express();

const routes = require('./routes/router');
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

// Serve front-end static files

app.use('/', express.static(process.env.FRONTEND || 'src/static'));
app.use('/', express.static('src/static'));