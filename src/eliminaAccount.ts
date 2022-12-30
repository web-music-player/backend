import express from 'express';
import { Types } from 'mongoose';

const router  = express.Router();

import Utente, { Utente as UtenteT } from './models/utente';
import Preferiti, { Preferiti as PreferitiT } from './models/preferiti';


// Remove a user
router.delete('/api/eliminaAccount', async (req, res) => {

    // Input validation
    if (!Types.ObjectId.isValid(req.body.idUtente)) {
        res.status(400).json({ message: 'Il valore inserito per l\'utente non è un ID valido' });
        return;
    }

    // Check if the user exists

    let utente = await Utente.findById(req.body.idUtente).exec();
    if (!utente) {
        res.status(404).json({ message: 'Utente non trovato' });
        return;
    }

    // Delete the user
    await utente.deleteOne();

    // Rimuovi la lista preferiti dell'utente
    let preferiti = await Preferiti.find({ utente: req.body.idUtente })

    if (preferiti.length !== 0) {
        await Preferiti.deleteOne({ id: preferiti[0].id });
    }

    res.sendStatus(204);
});

export default router;