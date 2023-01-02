import request from 'supertest';

import mongoose from 'mongoose';

import app from '../src/app';
import { generaUtenteTest, generaBranoTest } from '../scripts';

describe('Testing dell\'API di eliminazione account', () => {

    let connection;
    let id: string, token: string, idBrano: string;

    beforeAll(async () => {
        mongoose.set('strictQuery', true);
        connection = await mongoose.connect(process.env.MONGODB_URI || "");

        ({ id, token } = await generaUtenteTest());
        idBrano = await generaBranoTest(id);
    });

    afterAll(async () => {
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
