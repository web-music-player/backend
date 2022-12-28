import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import app from './app';
import Utente from './models/utente';

dotenv.config();

describe('Testing dell\'API di eliminazione account', () => {

    let connection;
    let id: string, token: string;

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');

        mongoose.set('strictQuery', true);
        connection = await mongoose.connect(process.env.MONGODB_URI || "");

        ({ id, token } = await generaUtente());
    });
    
    afterAll(() => {
        mongoose.connection.close(true);
    });
    
    test('ID non valido', async () => {
        const response = await request(app)
            .delete('/api/eliminaAccount')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .send({
                idUtente: 'ID non valido'
            })
            
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({ message: 'Il valore inserito per l\'utente non è un ID valido' });
    });

    test('Utente non trovato', async () => {
        const response = await request(app)
            .delete('/api/eliminaAccount')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .send({
                idUtente: '000000000000000000000000'
            })
            
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({ message: 'Utente non trovato' });
    })

    test('Eliminazione utente', async() => {

        const response = await request(app)
            .delete('/api/eliminaAccount')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .send({
                idUtente: id
            })
        
        expect(response.statusCode).toBe(204);
    })
});

async function generaUtente() {
    let nuovoUtente = new Utente({
        email: 'email@valida.com',
        password: 'PasswordValida&',
        tipoAccount: 'standard'
    });

    nuovoUtente = await nuovoUtente.save();
    
    var payload = {
        id: nuovoUtente.id,
        email: nuovoUtente.email,
        tipoAccount: nuovoUtente.tipoAccount
    }
    var options = {
        expiresIn: 86400
    }

    const token = jwt.sign(payload, process.env.SUPER_SECRET || "web-music-player", options);
    
    return { id: nuovoUtente.id, token: token }
}