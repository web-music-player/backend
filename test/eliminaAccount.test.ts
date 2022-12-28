import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import app from '../src/app';
import Utente from '../src/models/utente';
import { generaUtenteTest } from '../src/scripts';

dotenv.config();

describe('Testing dell\'API di eliminazione account', () => {

    let connection;
    let id: string, token: string;

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');

        mongoose.set('strictQuery', true);
        connection = await mongoose.connect(process.env.MONGODB_URI || "");

        ({ id, token } = await generaUtenteTest());
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
