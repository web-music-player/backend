import express from 'express';
import { Types } from 'mongoose';

const router  = express.Router();

import Utente, { Utente as UtenteT } from './models/utente';
import Brano, { Brano as BranoT } from './models/brano';
import Preferiti, { Preferiti as PreferitiT } from './models/preferiti';

// Get a user's favorite songs
router.get('/api/preferiti/:idUtente', async (req, res) => {

    const idUtente = req.params.idUtente;

    // Input validation
    if (!Types.ObjectId.isValid(idUtente)) {
        res.status(400).json({ message: 'Il valore inserito per l\'utente non è un ID valido' });
        return;
    }

    // Check if the user actually exists

    let utente = await Utente.findById(idUtente).exec();

    if (!utente) {
        res.status(404).json({ message: 'Utente non registrato' });
        return;
    }

    // Check if the document has already been created
    let preferiti = (await Preferiti.find({ utente: idUtente }))[0];

    // If not, create one and reassign the 'preferiti' variable
    if (!preferiti) {
        preferiti = await creaPreferiti(idUtente);
    }

    res.status(200).json({ idBrani: preferiti.listaBrani });
});

// Add or remove a song from a user's favorites
router.patch('/api/preferiti/modifica', async (req, res) => {

    // Input validation

    if (!Types.ObjectId.isValid(req.body.idUtente)) {
        res.status(400).json({ message: 'Il valore inserito per l\'utente non è un ID valido' });
        return;
    }

    if (!Types.ObjectId.isValid(req.body.idBrano)) {
        res.status(400).json({ message: 'Il valore inserito per il brano non è un ID valido' });
        return;
    }

    if (req.body.azione !== 'aggiunta' && req.body.azione !== 'rimozione') {
        res.status(400).json({ message: 'Il campo \'azione\' accetta i valori \'aggiunta\' e \'rimozione\''});
        return;
    }

    // Check if the user actually exists

    let utente = await Utente.findById(req.body.idUtente).exec();

    if (!utente) {
        res.status(404).json({ message: 'Utente non registrato' });
        return;
    }

    // Check if the song exists

    let brano = await Brano.findById(req.body.idBrano);

    if (!brano) {
        res.status(404).json({ message: 'Brano non trovato' });
        return;
    }

    // At this point in time I'm sure the user exists
    // I try to get the user's favorites; if they don't exist yet,
    // create the document

    let preferiti = (await Preferiti.find({ utente: req.body.idUtente }))[0];

    if (!preferiti) {
        preferiti = await creaPreferiti(req.body.idUtente);
    }

    // Add or remove the song
    if (req.body.azione === 'aggiunta') {

        if (preferiti.listaBrani.indexOf(req.body.idBrano) !== -1) {
            res.status(409).json({ message: 'Il brano da aggiungere è già presente' });
            return;
        }

        // Add the given song to the favorites if not already present
        await Preferiti.updateOne({
                _id: preferiti.id
            }, {
                $addToSet: { listaBrani: req.body.idBrano }
            }
        );
    }
    else if (req.body.azione === 'rimozione') {

        if (preferiti.listaBrani.indexOf(req.body.idBrano) === -1) {
            res.status(409).json({ message: 'Il brano da rimuovere non è presente' });
            return;
        }

        // Remove the given song from the favorites if present
        await Preferiti.updateOne({
                _id: preferiti.id
            }, {
                $pull: { listaBrani: req.body.idBrano }
            }
        );
    }
    
    preferiti = (await Preferiti.find({ utente: req.body.idUtente }))[0];
    res.status(200).json({ idBrani: preferiti.listaBrani });
});

async function creaPreferiti(idUtente: string) {
    let nuoviPreferiti = new Preferiti({
        utente: idUtente,
        listaBrani: []
    });

    await nuoviPreferiti.save()
    return (await Preferiti.find({ utente: idUtente }))[0];
}

export default router;
