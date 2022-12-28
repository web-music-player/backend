import request from 'supertest';
import mongoose from 'mongoose';

import app from '../src/app';
import { generaUtenteTest, eliminaUtenteTest } from '../scripts';

let connection;
let id: string, token: string;

beforeAll(async () => {
    mongoose.set('strictQuery', true);
    connection = await mongoose.connect(process.env.MONGODB_URI || "");
    ({ id, token } = await generaUtenteTest());
});

afterAll(async () => {
    await eliminaUtenteTest(id);
    mongoose.connection.close(true);
});

describe('Testing dell\'API per il carimento di un brano', () => {

    test.todo('Richiesta non valida');
    test.todo('Artista non trovato');
    test.todo('Brano aggiunto al sistema');
    test.todo('Un brano con lo stesso nome è già presente');
});

describe('Testing dell\'API per la modifica di un brano', () => {

    test.todo('Richiesta non valida');
    test.todo('Brano non trovato');
    test.todo('Un brano con lo stesso nome è già presente');
    test.todo('Modifica effettuata');
});

describe('Testing dell\'API per ottenere un brano dall\'ID', () => {

    test.todo('Richiesta non valida');
    test.todo('Brano non trovato');
    test.todo('Brano trovato');
});

describe('Testting dell\'API per la ricerca di un brano', () => {

    test.todo('Ricerca di un brano esistente');
    test.todo('Ricerca di un brano non esistente');
});

describe('Testing dell\'API per l\'eliminazione di un brano', () => {

    test.todo('Richiesta non valida');
    test.todo('Brano non trovato');
    test.todo('Rimozione brano');
});
