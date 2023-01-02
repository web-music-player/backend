import request from 'supertest';
import mongoose, { Types } from 'mongoose';

import Brano, { Brano as BranoT } from '../src/models/brano';
import app from '../src/app';
import { generaUtenteTest, eliminaUtenteTest, generaBranoTest, eliminaBranoTest } from '../scripts';

let connection;

let idStandard: string, tokenStandard: string;
let idCreator: string, tokenCreator: string;

let idBrano: string, idSecondoBrano: string;

beforeAll(async () => {
    mongoose.set('strictQuery', true);
    connection = await mongoose.connect(process.env.MONGODB_URI || "");

    ({ id: idStandard, token: tokenStandard } = await generaUtenteTest());
    ({ id: idCreator, token: tokenCreator } = await generaUtenteTest('creator'));
    
    idSecondoBrano = await generaBranoTest(idCreator, 'TitoloTest')
});

afterAll(async () => {
    await eliminaUtenteTest(idStandard);
    await eliminaUtenteTest(idCreator);

    mongoose.connection.close(true);
});

describe('Testing dell\'API per il carimento di un brano', () => {

    test('Richiesta incompleta', async () => {
        const response = await request(app)
            .post('/api/brano')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            .send({
                tags: []
            })
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'Parametri insufficienti: sono necessari il nome, l\'ID dell\'artista e la durata del brano' });
    });

    test('ID artista non valido', async () => {
        const response = await request(app)
            .post('/api/brano')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            .send({
                nomeBrano: 'Titolo',
                idUtente: 'idNonValido',
                durata: 1,
                tags: []
            })
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'Il valore inserito per l\'artista non è un ID valido' });
    });

    test('Durata non valida', async () => {
        const response = await request(app)
            .post('/api/brano')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            .send({
                nomeBrano: 'Titolo',
                idUtente: idStandard,
                durata: -1,
                tags: []
            })
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'Il valore inserito per la durata deve essere un numero intero positivo' });
    });

    test('Utente non creator', async () => {
        const response = await request(app)
            .post('/api/brano')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            .send({
                nomeBrano: 'Titolo',
                idUtente: idStandard,
                durata: 1,
                tags: []
            })
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'Il valore inserito per l\'ID dell\'artista non corrisponde ad un account creator' });
    });

    test('Artista non trovato', async () => {
        const response = await request(app)
            .post('/api/brano')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            .send({
                nomeBrano: 'Titolo',
                idUtente: '000000000000000000000000',
                durata: 1,
                tags: []
            })
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: 'Artista non trovato' });
    });

    test('Brano aggiunto al sistema', async () => {
        const response = await request(app)
            .post('/api/brano')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            .send({
                nomeBrano: 'TitoloBranoDiTest',
                idUtente: idCreator,
                durata: 1,
                tags: []
            })
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({ nome: 'TitoloBranoDiTest', artista: idCreator, durata: 1, tags: []});

        const secondResponse = await request(app)
            .post('/api/brano')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            .send({
                nomeBrano: 'TitoloBrano',
                idUtente: idCreator,
                durata: 1,
                tags: []
            })
        
        expect(secondResponse.statusCode).toBe(201);
        expect(secondResponse.body).toMatchObject({ nome: 'TitoloBrano', artista: idCreator, durata: 1, tags: []});
    });

    test('Un brano con lo stesso nome è già presente', async () => {
        const response = await request(app)
            .post('/api/brano')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            .send({
                nomeBrano: 'TitoloBranoDiTest',
                idUtente: idCreator,
                durata: 1,
                tags: []
            })
        
        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({ message: 'Brano già caricato' });
    });
});

describe('Testting dell\'API per la ricerca di un brano', () => {

    test('Ricerca di un brano esistente', async () => {
        const response = await request(app)
            .get('/api/ricerca/TitoloBranoDiTest')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)

        expect(response.statusCode).toBe(200);
        
        let risultati:BranoT[] = response.body;
        let brano:BranoT;

        risultati.forEach((res:any) => {
            if (res['nome'] === 'TitoloBranoDiTest' && (res['artista']).toString() === idCreator) {
                idBrano = (res['_id']).toString();
            }
        });

    });

    test('Ricerca di un brano non esistente', async () => {
        const response = await request(app)
            .get('/api/ricerca/AitoloBranoDiTest')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

});

describe('Testing dell\'API per la modifica di un brano', () => {

    test('Parametri insufficienti', async () => {
        const response = await request(app)
            .patch('/api/brano')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            .send({
                idBrano: '',
                nomeBrano: '',
                tags: []
            })
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'Parametri insufficienti: sono necessari l\'ID del brano e o il nome del brano, o i tags del brano' });
    });

    test('ID brano non valido', async () => {
        const response = await request(app)
            .patch('/api/brano')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            .send({
                idBrano: 'idNonValido',
                nomeBrano: 'Titolo2',
                tags: []
            })
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'Il valore inserito per il brano non è un ID valido' });
    });
    
    test('Brano non trovato', async () => {
        const response = await request(app)
            .patch('/api/brano')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            .send({
                idBrano: '000000000000000000000000',
                nomeBrano: 'Titolo2',
                tags: []
            })
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: 'Brano non trovato' });
    });
    
    test('Modifica effettuata', async () => {
        const response = await request(app)
            .patch('/api/brano')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            .send({
                idBrano: idBrano,
                nomeBrano: 'NuovoTitoloBranoDiTest',
                tags: []
            })
        
        expect(response.statusCode).toBe(200);
    });
    
    test('Un brano con lo stesso nome è già presente', async () => {
        const response = await request(app)
            .patch('/api/brano')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            .send({
                idBrano: idBrano,
                nomeBrano: 'TitoloBrano',
                tags: []
            })
        
        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({ message: 'Esiste un brano con lo stesso nome' });
    });
});

describe('Testing dell\'API per ottenere un brano dall\'ID', () => {

    test('Richiesta non valida', async () => {
        const response = await request(app)
            .get('/api/brano/idNonValido')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'Il valore inserito per il brano non è un ID valido' })
    });

    test('Brano non trovato', async () => {
        const response = await request(app)
            .get('/api/brano/000000000000000000000000')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: 'Brano non trovato' });
    });

    test('Brano trovato', async () => {
        const response = await request(app)
            .get('/api/brano/' + idBrano)
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({ nome: 'NuovoTitoloBranoDiTest', artista: idCreator }))
    });

});

describe('Testing dell\'API per l\'eliminazione di un brano', () => {

    test('Richiesta non valida', async () => {
        const response = await request(app)
            .delete('/api/brano')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            .send({
                idBrano: 'idNonValido'
            })
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'Il valore inserito per il brano non è un ID valido' });
    });

    test('Brano non trovato', async () => {
        const response = await request(app)
            .delete('/api/brano')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            .send({
                idBrano: '000000000000000000000000'
            })
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: 'Brano non trovato' });
    });

    test('Rimozione brano', async () => {
        const response = await request(app)
            .delete('/api/brano')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            .send({
                idBrano: idBrano
            })
        
        expect(response.statusCode).toBe(204);

        const secondResponse = await request(app)
            .delete('/api/brano')
            .set('Accept', 'application/json')
            .set('x-access-token', tokenStandard)
            .send({
                idBrano: idSecondoBrano
            })
        
        expect(secondResponse.statusCode).toBe(204);
    });

});
