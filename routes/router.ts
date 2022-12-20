// Dependencies

import express from 'express';
import { Types } from 'mongoose';

const router  = express.Router();

// Models

import Utente, { Utente as UtenteT } from '../models/utente';
import Brano, { Brano as BranoT } from '../models/brano';
import Preferiti, { Preferiti as PreferitiT } from '../models/preferiti';

// Application routes

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
        id: nuovoUtente.id,
        email: nuovoUtente.email,
        tipoAccount: nuovoUtente.tipoAccount
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
        id: utente.id,
        email: utente.email,
        tipoAccount: utente.tipoAccount
    });
});

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

    res.sendStatus(204);
    });

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

    if (!req.body.nomeBrano || !req.body.idArtista || !req.body.durata) {
        res.status(400).json({ message: 'Parametri insufficienti: sono necessari il nome, l\'ID dell\'artista e la durata del brano' });
        return;
    }

    if (!Types.ObjectId.isValid(req.body.idArtista)) {
        res.status(400).json({ message: 'Il valore inserito per l\'artista non è un ID valido' });
        return;
    }

    const durata = parseInt(req.body.durata);

    if (isNaN(durata) || durata < 1 || durata + '' !== req.body.durata) {
        res.status(400).json({ message: 'Il valore inserito per la durata deve essere un numero intero positivo' });
        return;
    }

    // Check if a song already exists

    let brano = await Brano.findOne({ nome: req.body.nomeBrano, artista: req.body.idArtista });

    if (brano) {
        res.status(409).json({ message: 'Brano già caricato' });
        return;
    }

    // Create a new song object
    let nuovoBrano = new Brano({
        nome: req.body.nomeBrano,
        artista: req.body.idArtista,
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
})

// Get a user's favorite songs
router.get('/api/preferiti/:id', async (req, res) => {

    const idUtente = req.params.id;

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
    let preferiti = await Preferiti.find({ utente: idUtente });

    // If not, create one and reassign the 'preferiti' variable
    if (preferiti.length != 1) {
        let nuoviPreferiti = new Preferiti({
            utente: idUtente,
            listaBrani: []
        });

        await nuoviPreferiti.save()
        preferiti = await Preferiti.find({ utente: idUtente });
    }

    res.status(200).json({ idBrani: preferiti[0].listaBrani });
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

    // At this point in time I'm sure the user exists
    // I try to get the user's favorites; if they don't exist yet,
    // create the document

    let preferiti = (await Preferiti.find({ utente: req.body.idUtente }))[0];

    if (!preferiti) {
        let nuoviPreferiti = new Preferiti({
            utente: utente,
            listaBrani: []
        });

        await nuoviPreferiti.save()
        preferiti = (await Preferiti.find({ utente: utente }))[0];
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

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
export function validateEmail(text: string) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}

// Password valida: lunghezza >= 8 caratteri, una maiuscola, una minuscola, un carattere speciale (%&#!@*^)
// https://stackoverflow.com/a/59116316
export function validatePassword(text: string) {
    var re = /^((?=.*[a-z])(?=.*[A-Z])(?=.*[%&#!@\*\^]).{8,})$/;
    return re.test(text);
}

export default router;
