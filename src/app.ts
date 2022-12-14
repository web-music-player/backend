// Dependencies

require('dotenv').config();

import express from 'express';
import mongoose from 'mongoose';

import { Express } from 'express';

// Create the app instance

const app: Express = express();

// Set connection values

const port: string = process.env.PORT || "8080";
const mongodb_uri: string = process.env.MONGODB_URI || "";

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