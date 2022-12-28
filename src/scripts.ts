import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import Utente, { Utente as UtenteT }  from './models/utente';

dotenv.config();
const secret = process.env.SUPER_SECRET || "web-music-player";

export function tokenChecker(req: Request, res: Response, next: NextFunction) {
	
	const token = req.body.token || req.query.token || req.headers['x-access-token'];

    // Se il token non viene presentato
	if (!token) {
        res.status(401).json({ message: 'Token mancante' });
        return;
	}

	// Estrae il token e verifica correttezza e validità
	jwt.verify(token, secret, {}, (err, decoded) => {			
		if (err) {
			res.status(403).send({ message: 'Autenticazione tramite token fallita.' });
            return;
		} else {
			next();
		}
	});	
};

export function generaToken(utente: UtenteT) {

    var payload = {
        id: utente.id,
        email: utente.email,
        tipoAccount: utente.tipoAccount
    }
    var options = {
        expiresIn: 86400
    }

    const token = jwt.sign(payload, secret, options);

    return token;
}

export async function generaUtenteTest() {
    let nuovoUtente = new Utente({
        email: 'email@valida.com',
        password: 'PasswordValida&',
        tipoAccount: 'standard'
    });

    nuovoUtente = await nuovoUtente.save();
    const token = generaToken(nuovoUtente)
    
    return { id: nuovoUtente.id, token: token }
}

export async function eliminaUtenteTest(id: string) {

    let utente = await Utente.findById(id).exec();

    if (!utente) {
        fail('Impossibile eliminare l\'account test')
    }
    
    await utente.deleteOne();
}
