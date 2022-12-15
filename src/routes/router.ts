// Dependencies
import express, { Request, Response } from 'express';

// Router
const router  = express.Router();

// Models
const Utente = require('../models/utente')

// Routes

router.post('/registration', (req: Request, res: Response) => {

    // TODO: need to handle non-complete forms
    // Will use a function to validate the input on the front-end

    Utente.findOne({ email: req.body.email }, (err: any, data: any) => {

        if (!data) {

            const nuovoUtente = new Utente({
                email: req.body.email,
                password: req.body.password,
                tipoAccount: req.body.tipoAccount
            })

            nuovoUtente.save((err: any, data: any) => {
                if (err) {
                    return res.json({Error: err});
                }
                return res.send('Utente registrato!');
            })

        } else {
            if (err) {
                return res.json(`Errore nella richiesta al database: ${err}`);
            }
            return res.send('Utente già registrato!');
        }
    })    
});

router.post('/login', async (req: Request, res: Response) => {

    let utente = await Utente.findOne({
        email: req.body.email
    }).exec();

    // Utente non presente nel database
    if (!utente) {
        res.send('Utente non registrato!')
        return;
    }

    // Controllo della password
	if (utente.password != req.body.password) {
		res.send('Password non corretta!')
        return;
	}

    res.send('Accesso eseguito!')
});

module.exports = router;
