import express from 'express';
import { Types } from 'mongoose';

const router  = express.Router();

import Utente, { Utente as UtenteT } from './models/utente';
import Brano, { Brano as BranoT } from './models/brano';

// Get a song by its id
router.get('/api/brano/:idBrano', async (req, res) => {

    // Input validation
    if (!Types.ObjectId.isValid(req.params.idBrano)) {
        res.status(400).json({ message: 'Il valore inserito per il brano non è un ID valido' });
        return;
    }

    let brano = await Brano.findById(req.params.idBrano);

    // Check if the song exists
    if (!brano) {
        res.status(404).json({ message: 'Brano non trovato' });
        return;
    }

    // Return the song
    res.status(200).json({
        id: brano.id,
        nome: brano.nome,
        artista: brano.artista,
        durata: brano.durata,
        tags: brano.tags
    });
});

// Add a new song
router.post('/api/brano', async (req, res) => {

    // Input validation

    if (!req.body.nomeBrano || !req.body.idUtente || !req.body.durata) {
        res.status(400).json({ message: 'Parametri insufficienti: sono necessari il nome, l\'ID dell\'artista e la durata del brano' });
        return;
    }

    if (!Types.ObjectId.isValid(req.body.idUtente)) {
        res.status(400).json({ message: 'Il valore inserito per l\'artista non è un ID valido' });
        return;
    }

    const durata = parseInt(req.body.durata);

    if (isNaN(durata) || durata < 1) {
        res.status(400).json({ message: 'Il valore inserito per la durata deve essere un numero intero positivo' });
        return;
    }

    let artista = await Utente.findOne({ id: req.body.idUtente });
    if (artista) {
        if (artista.tipoAccount !== 'creator') {
            res.status(400).json({ message: 'Il valore inserito per l\'ID dell\'artista non corrisponde ad un account creator' })
            return;
        }
    }
    else {
        res.status(404).json({ message: 'Artista non trovato' })
        return;
    }

    // Check if a song already exists

    let brano = await Brano.findOne({ nome: req.body.nomeBrano, artista: req.body.idUtente });

    if (brano) {
        res.status(409).json({ message: 'Brano già caricato' });
        return;
    }

    // Create a new song object
    let nuovoBrano = new Brano({
        nome: req.body.nomeBrano,
        artista: req.body.idUtente,
        durata: req.body.durata,
        tags: req.body.tags
    });

    // Save the new song in the database
    nuovoBrano = await nuovoBrano.save();

    // Return the newly created user
    res.status(201).json({
        id: nuovoBrano.id,
        nome: nuovoBrano.nome,
        artista: nuovoBrano.artista,
        durata: nuovoBrano.durata,
        tags: nuovoBrano.tags
    });
});

// Update an already existing song's name or tags
router.patch('/api/brano', async (req, res) => {

    // Input validation

    if (!req.body.nomeBrano || !req.body.tags) {
        res.status(400).json({ message: 'Parametri insufficienti: sono necessari l\'ID del brano e o il nome del brano, o i tags del brano' });
        return;
    }

    if (!Types.ObjectId.isValid(req.body.idBrano)) {
        res.status(400).json({ message: 'Il valore inserito per il brano non è un ID valido' });
        return;
    }

    // Check if the song exists

    let brano = await Brano.findById(req.body.idBrano).exec();

    if (!brano) {
        res.status(404).json({ message: 'Brano non trovato' });
        return;
    }

    // Check if the update would conflict with an already existing song

    // I can apply the update only if there's no songs
    // by the same artist with the name we want to assign

    let branoEsistente = await Brano.find({
        nome: req.body.nomeBrano,
        artista: brano.artista
    });

    if (branoEsistente.length !== 0 && branoEsistente[0].id !== req.body.idBrano) {
        res.status(409).json({ message: 'Esiste un brano con lo stesso nome' });
        return;
    }

    await Brano.updateOne(
        {
            _id: req.body.idBrano
        },
        {
            $set: {
                nome: req.body.nomeBrano,
                tags: req.body.tags
            }
        }
    );

    res.sendStatus(200);
});

// Remove a song
router.delete('/api/brano', async (req, res) => {

    // Input validation
    if (!Types.ObjectId.isValid(req.body.idBrano)) {
        res.status(400).json({ message: 'Il valore inserito per l\'artista non è un ID valido' });
        return;
    }

    // Check if the song exists

    let brano = await Brano.findById(req.body.idBrano).exec();

    if (!brano) {
        res.status(404).json({ message: 'Brano non trovato' });
        return;
    }

    // Delete the song
    await brano.deleteOne();
    
    res.sendStatus(204);
});

// Search for a song in the database
router.get('/api/ricerca/:testo', async (req, res) => {

    let risultati = await Brano.find({$text: {$search: req.params.testo}}).limit(10);

    res.status(200).json(risultati);
});

export default router;
