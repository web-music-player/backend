// Dependencies
import express, { Request, Response } from 'express';

// Router
const router  = express.Router();

// Models
const Utente = require('../models/utente')

// Routes

router.post('/registration', (req: Request, res: Response) => {

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
                return res.json(data);
            })

        } else {
            if (err) {
                return res.json(`Errore nella richiesta al database: ${err}`);
            }
            return res.json({message: "Utente già esistente"});
        }
    })    
});

module.exports = router;
