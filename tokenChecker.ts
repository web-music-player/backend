import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.SUPER_SECRET || "web-music-player";

const tokenChecker = function(req: Request, res: Response, next: NextFunction) {
	
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

export default tokenChecker;
