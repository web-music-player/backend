import request from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import app from '../src/app';
import { eliminaUtenteTest } from '../scripts';

dotenv.config();

let connection;

beforeAll(async () => {
    mongoose.set('strictQuery', true);
    connection = await mongoose.connect(process.env.MONGODB_URI || "");
});

afterAll(async () => {
    mongoose.connection.close(true);
});

describe('Testing delle API di autenticazione', () => {
    
    test('Email non valida', async () => {
        const response = await request(app)
            .post('/api/auth/registrazione')
            .set('Accept', 'application/json')
            .send({
                email: 'email non valida',
                password: 'PasswordValida&',
                tipoAccount: 'standard'
            })
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({ message: 'Il campo \'email\' deve essere una stringa non vuota, in formato email. Il campo \'password\' deve essere rispettare i requisiti di validità' });
    });


    test('Password non valida', async () => {
        const response = await request(app)
            .post('/api/auth/registrazione')
            .set('Accept', 'application/json')
            .send({
                email: 'emailvalida@gmail.com',
                password: 'password non valida',
                tipoAccount: 'standard'
            })
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({ message: 'Il campo \'email\' deve essere una stringa non vuota, in formato email. Il campo \'password\' deve essere rispettare i requisiti di validità' });
    });


    test('Tipo account non valido', async () => {
        const response = await request(app)
            .post('/api/auth/registrazione')
            .set('Accept', 'application/json')
            .send({
                email: 'emailvalida@gmail.com',
                password: 'PasswordValida&',
                tipoAccount: 'tipo non valido'
            })
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({ message: 'Il campo \'tipoAccount\' accetta i valori \'standard\' e \'creator\''});
    });

    test('Registrazione', async () => {
        const response = await request(app)
            .post('/api/auth/registrazione')
            .set('Accept', 'application/json')
            .send({
                email: 'emailvalida@gmail.com',
                password: 'PasswordValida&',
                tipoAccount: 'creator'
            })
        expect(response.statusCode).toBe(201)
        
        // Verifica la presenza di ID, token, e la validità del token

        expect(response.body)
            .toEqual(expect.objectContaining({ id: expect.any(String), token: expect.any(String)}));

        let token = response.body.token || "";
        jwt.verify(token, process.env.SUPER_SECRET || "web-music-player", {}, (err, decoded) => {			
            if (err) {
                fail('Token non valido')
            }
        });	
    });

    test('Utente già registrato', async () => {
        const response = await request(app)
            .post('/api/auth/registrazione')
            .set('Accept', 'application/json')
            .send({
                email: 'emailvalida@gmail.com',
                password: 'PasswordValida&',
                tipoAccount: 'creator'
            })
        expect(response.statusCode).toBe(409)
        expect(response.body).toEqual({ message: 'Utente già registrato'});
    });

    test('Utente non registrato', async () => {
        const response = await request(app)
            .post('/api/auth/accesso')
            .set('Accept', 'application/json')
            .send({
                email: 'indirizzoNonValidoQuindiNonRegistrato',
                password: 'PasswordValida&',
            })
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({ message: 'Utente non registrato'});
    });

    test('Password non corretta', async () => {
        const response = await request(app)
            .post('/api/auth/accesso')
            .set('Accept', 'application/json')
            .send({
                email: 'emailvalida@gmail.com',
                password: 'PasswordErrata',
            })
        expect(response.statusCode).toBe(403)
        expect(response.body).toEqual({ message: 'Password non corretta'});
    });

    test('Accesso', async () => {
        const response = await request(app)
            .post('/api/auth/accesso')
            .set('Accept', 'application/json')
            .send({
                email: 'emailvalida@gmail.com',
                password: 'PasswordValida&',
            })
        expect(response.statusCode).toBe(200)

        // Verifica la presenza di ID, token, e la validità del token

        expect(response.body)
            .toEqual(expect.objectContaining({ id: expect.any(String), token: expect.any(String)}));

        let token = response.body.token || "";
        jwt.verify(token, process.env.SUPER_SECRET || "web-music-player", {}, (err, decoded) => {			
            if (err) {
                fail('Token non valido')
            }
        });	

        // Rimuovo l'account creato per il testing
        await eliminaUtenteTest(response.body.id);
    });

});
