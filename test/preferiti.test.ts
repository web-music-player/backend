import request from 'supertest';
import mongoose from 'mongoose';

import app from '../src/app';
import { generaUtenteTest, eliminaUtenteTest, generaBranoTest, eliminaBranoTest } from '../scripts';
import e from 'express';

let connection;
let idUtente: string, token: string, idBrano: string;

beforeAll(async () => {
    mongoose.set('strictQuery', true);
    connection = await mongoose.connect(process.env.MONGODB_URI || "");
    ({ id: idUtente, token } = await generaUtenteTest());
    idBrano = await generaBranoTest(idUtente);
});

afterAll(async () => {
    await eliminaUtenteTest(idUtente);
    await eliminaBranoTest(idBrano);
    mongoose.connection.close(true);
});

describe('Testing dell\'API per ottenere i preferiti', () => {

    test('Richiesta non valida', async () => {
        const response = await request(app)
            .get('/api/preferiti/idNonValido')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({ message: 'Il valore inserito per l\'utente non è un ID valido' });
    });

    test('Utente non trovato', async () => {
        const response = await request(app)
            .get('/api/preferiti/000000000000000000000000')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({ message: 'Utente non registrato' });
    });

    test('Lista dei preferiti trovata', async () => {
        const response = await request(app)
            .get('/api/preferiti/' + idUtente)
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            
        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject({ idBrani: [] })
    });

});

describe('Testing dell\'API per la modifica dei preferiti', () => {

    test('ID utente non valido', async () => {
        const response = await request(app)
            .patch('/api/preferiti/modifica')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .send({
                idUtente: 'idNonValido',
                idBrano: idBrano,
                azione: 'aggiunta'
            })
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'Il valore inserito per l\'utente non è un ID valido' });
    });

    test('ID brano non valido', async () => {
        const response = await request(app)
            .patch('/api/preferiti/modifica')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .send({
                idUtente: idUtente,
                idBrano: 'idNonValido',
                azione: 'aggiunta'
            })
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'Il valore inserito per il brano non è un ID valido' });
    });

    test('Azione non eseguibile', async () => {
        const response = await request(app)
            .patch('/api/preferiti/modifica')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .send({
                idUtente: idUtente,
                idBrano: idBrano,
                azione: 'azioneNonValida'
            })
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'Il campo \'azione\' accetta i valori \'aggiunta\' e \'rimozione\''});
    });

    test('Utente non trovato', async () => {
        const response = await request(app)
            .patch('/api/preferiti/modifica')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .send({
                idUtente: '000000000000000000000000',
                idBrano: idBrano,
                azione: 'aggiunta'
            })
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: 'Utente non registrato'});
    });

    test('Brano non trovato', async () => {
        const response = await request(app)
            .patch('/api/preferiti/modifica')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .send({
                idUtente: idUtente,
                idBrano: '000000000000000000000000',
                azione: 'aggiunta'
            })
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: 'Brano non trovato'});
    });

    test('Rimozione non valida', async () => {
        const response = await request(app)
            .patch('/api/preferiti/modifica')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .send({
                idUtente: idUtente,
                idBrano: idBrano,
                azione: 'rimozione'
            })
        
        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({ message: 'Il brano da rimuovere non è presente'});
    });

    test('Modifica effettuata', async () => {
        const response = await request(app)
            .patch('/api/preferiti/modifica')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .send({
                idUtente: idUtente,
                idBrano: idBrano,
                azione: 'aggiunta'
            })
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ idBrani: [idBrano]});
    });

    test('Aggiunta non valida', async () => {
        const response = await request(app)
            .patch('/api/preferiti/modifica')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .send({
                idUtente: idUtente,
                idBrano: idBrano,
                azione: 'aggiunta'
            })
        
        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({ message: 'Il brano da aggiungere è già presente'});
    });
});
