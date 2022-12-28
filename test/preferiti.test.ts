import request from 'supertest';
import mongoose from 'mongoose';

import app from '../src/app';
import { generaUtenteTest, eliminaUtenteTest, generaBranoTest, eliminaBranoTest } from '../scripts';

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

    test.todo('Richiesta non valida');
    test.todo('Utente non trovato');
    test.todo('Lista dei preferiti trovata');
});

describe('Testing dell\'API per la modifica dei preferiti', () => {

    test.todo('Richiesta non valida');
    test.todo('Utenet/Brano non trovato');
    test.todo('Azione non valida');
    test.todo('Modifica effettuata');
});
