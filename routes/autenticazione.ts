import express from 'express';
import { Types } from 'mongoose';

const router  = express.Router();

import Utente, { Utente as UtenteT } from '../models/utente';

// Add a new user
router.post('/api/auth/registrazione', async (req, res) => {

    // Request format and input validation

    if (!(validateEmail(req.body.email) && validatePassword(req.body.password))) {
        res.status(400).json({ message: 'Il campo \'email\' deve essere una stringa non vuota, in formato email. Il campo \'password\' deve essere rispettare i requisiti di validità' });
        return;
    }
    
    if (req.body.tipoAccount !== 'standard' && req.body.tipoAccount != 'creator') {
        res.status(400).json({ message: 'Il campo \'tipoAccount\' accetta i valori \'standard\' e \'creator\''});
    }

    // Check if that email address is already registered

    let utente = await Utente.findOne({ email: req.body.email });

    if (utente) {
        res.status(409).json({ message: 'Utente già registrato' });
        return;
    }

    // Create a new user object
    let nuovoUtente = new Utente({
        email: req.body.email,
        password: req.body.password,
        tipoAccount: req.body.tipoAccount
    });

    // Save the new user in the database
    nuovoUtente = await nuovoUtente.save();

    // Return the newly created user
    res.status(201).json({
        id: nuovoUtente.id
    });
});

// Login
router.post('/api/auth/accesso', async (req, res) => {

    let utente = await Utente.findOne({ email: req.body.email });

    // Check if that email address is registered
    if (!utente) {
        res.status(404).json({ message: 'Utente non registrato' });
        return;
    }

    // Password check
	if (utente.password != req.body.password) {
		res.status(403).json({ message: 'Password non corretta' });
        return;
	}

    // Return the user information
    res.status(200).json({
        id: utente.id
    });
});

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(text: string) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}

// Password valida: lunghezza >= 8 caratteri, una maiuscola, una minuscola, un carattere speciale (%&#!@*^)
// https://stackoverflow.com/a/59116316
function validatePassword(text: string) {
    var re = /^((?=.*[a-z])(?=.*[A-Z])(?=.*[%&#!@\*\^]).{8,})$/;
    return re.test(text);
}

export default router;
