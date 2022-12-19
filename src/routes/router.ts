// Dependencies
import express, { Request, Response } from 'express';
import { AnyError } from 'mongodb';

// Router
const router  = express.Router();

// Models
import Utente, { Utente as UtenteT } from '../models/utente';
import Tag from '../models/tag';
import Brano from '../models/brano';
import Cronologia from '../models/cronologia';
import Playlist from '../models/cronologia';
import MusicaChePiace from '../models/musicachepiace';

// Routes

router.post('/registration', (req: Request, res: Response) => {

    // TODO: need to handle non-complete forms
    // Will use a function to validate the input on the front-end

    Utente.findOne({ email: req.body.emailRegistrazione }, (err?: AnyError, data?: UtenteT) => {

        if (!data) {

            const nuovoUtente = new Utente({
                email: req.body.emailRegistrazione,
                password: req.body.passwordRegistrazione,
                tipoAccount: req.body.tipoAccount
            })

            nuovoUtente.save((err?, _data?) => {
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
        email: req.body.emailLogin
    }).exec();

    // Utente non presente nel database
    if (!utente) {
        res.send('Utente non registrato!')
        return;
    }

    // Controllo della password
	if (utente.password != req.body.passwordLogin) {
		res.send('Password non corretta!')
        return;
	}

    res.send('Accesso eseguito!')
});

router.get('/api/utente/:id', async (req, res) => {

    let utente = await Utente.findById(req.params.id);

    res.status(200).json({
        id: utente?.id,
        email: utente?.email,
        tipoAccount: utente?.tipoAccount
    });
});

router.post('/api/utente', async (req, res) => {

    let utente = new Utente({
        email: req.body.email,
        password: req.body.password,
        tipoAccount: req.body.tipoAccount
    });

    utente = await utente.save();
    let id = utente.id;

    res.status(200).json({id: id});
});

router.get('/api/tag/:id', async (req, res) => {

    let tag = await Tag.findById(req.params.id);

    res.status(200).json({
        id: tag?.id,
        nome: tag?.nome
    });
});

router.post('/api/tag', async (req, res) => {

    let tag = new Tag({
        nome: req.body.nome
    });

    tag = await tag.save();
    let id = tag.id;

    res.status(200).json({id: id});
    
});

router.get('/api/brano/:id', async (req, res) => {

    let brano = await Brano.findById(req.params.id);

    res.status(200).json({
        id: brano?.id,
        nome: brano?.nome,
        artista: brano?.artista,
        durata: brano?.durata,
        tags: brano?.tags
    });
});

router.post('/api/brano', async (req, res) => {
    
    let brano = new Brano({
        nome: req.body.nome,
        artista: req.body.artista,
        durata: req.body.durata,
        tags: req.body.tags
    });

    brano = await brano.save();
    let id = brano.id;

    res.status(200).json({id: id});
});

router.get('/api/cronologia/:id', async (req, res) => {

    let cronologia = await Cronologia.findById(req.params.id);

    res.status(200).json({
        id: cronologia?.id,
        listaBrani: cronologia?.listaBrani
    });
});

router.post('/api/cronologia', async (req, res) => {
    
    let cronologia = new Cronologia({
        listaBrani: req.body.listaBrani
    });

    cronologia = await cronologia.save();
    let id = cronologia.id;

    res.status(200).json({id: id});
    
});

router.get('/api/playlist/:id', async (req, res) => {

    let playlist = await Playlist.findById(req.params.id);

    res.status(200).json({
        id: playlist?.id,
        listaBrani: playlist?.listaBrani
    });
});

router.post('/api/playlist', async (req, res) => {
    
    let playlist = new Playlist({
        listaBrani: req.body.listaBrani
    });

    playlist = await playlist.save();
    let id = playlist.id;

    res.status(200).json({id: id});
    
});

router.get('/api/musicachepiace/:id', async (req, res) => {

    let musicachepiace = await MusicaChePiace.findById(req.params.id);

    res.status(200).json({
        id: musicachepiace?.id,
        listaBrani: musicachepiace?.listaBrani
    });
});

router.post('/api/musicachepiace', async (req, res) => {
    
    let musicaChePiace = new MusicaChePiace({
        listaBrani: req.body.listaBrani
    });

    musicaChePiace = await musicaChePiace.save();
    let id = musicaChePiace.id;

    res.status(200).json({id: id});
    
});

export default router;
