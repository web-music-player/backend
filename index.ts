import app from './src/app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Set connection values

const port = process.env.PORT || 8080;
const mongodb_uri = process.env.MONGODB_URI || "";

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
