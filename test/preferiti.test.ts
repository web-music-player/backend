import request from 'supertest';
import mongoose, { Types } from 'mongoose';

import app from '../src/app';
import { generaUtenteTest, eliminaUtenteTest, generaBranoTest, eliminaBranoTest } from '../scripts';

let connection;
let idUtente_1: string, token_1: string, idBrano_1: string;
let idUtente_2: string, token_2: string, idBrano_2: string;

beforeAll(async () => {
    mongoose.set('strictQuery', true);
    connection = await mongoose.connect(process.env.MONGODB_URI || "");

    ({ id: idUtente_1, token: token_1 } = await generaUtenteTest('standard', false));
    ({ id: idUtente_2, token: token_2 } = await generaUtenteTest('standard', false));

    idBrano_1 = await generaBranoTest(idUtente_1);
    idBrano_2 = await generaBranoTest(idUtente_2);
});

afterAll(async () => {
    await eliminaUtenteTest(idUtente_1);
    await eliminaBranoTest(idBrano_1);

    await eliminaUtenteTest(idUtente_2);
    await eliminaBranoTest(idBrano_2);

    mongoose.connection.close(true);
});

describe('Testing dell\'API per ottenere i preferiti', () => {

    test('Richiesta non valida', async () => {
        const response = await request(app)
            .get('/api/preferiti/idNonValido')
            .set('Accept', 'application/json')
            .set('x-access-token', token_1)
            
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({ message: 'Il valore inserito per l\'utente non è un ID valido' });
    });

    test('Utente non trovato', async () => {
        const response = await request(app)
            .get('/api/preferiti/000000000000000000000000')
            .set('Accept', 'application/json')
            .set('x-access-token', token_1)
            
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({ message: 'Utente non registrato' });
    });

    test('Lista dei preferiti trovata', async () => {
        const response = await request(app)
            .get('/api/preferiti/' + idUtente_1)
            .set('Accept', 'application/json')
            .set('x-access-token', token_1)
            
        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject({ idBrani: [] })
    });

});

describe('Testing dell\'API per la modifica dei preferiti', () => {

    test('ID utente non valido', async () => {
        const response = await request(app)
            .patch('/api/preferiti/modifica')
            .set('Accept', 'application/json')
            .set('x-access-token', token_2)
            .send({
                idUtente: 'idNonValido',
                idBrano: idBrano_2,
                azione: 'aggiunta'
            })
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'Il valore inserito per l\'utente non è un ID valido' });
    });

    test('ID brano non valido', async () => {
        const response = await request(app)
            .patch('/api/preferiti/modifica')
            .set('Accept', 'application/json')
            .set('x-access-token', token_2)
            .send({
                idUtente: idUtente_2,
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
            .set('x-access-token', token_2)
            .send({
                idUtente: idUtente_2,
                idBrano: idBrano_2,
                azione: 'azioneNonValida'
            })
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'Il campo \'azione\' accetta i valori \'aggiunta\' e \'rimozione\''});
    });

    test('Utente non trovato', async () => {
        const response = await request(app)
            .patch('/api/preferiti/modifica')
            .set('Accept', 'application/json')
            .set('x-access-token', token_2)
            .send({
                idUtente: '000000000000000000000000',
                idBrano: idBrano_2,
                azione: 'aggiunta'
            })
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: 'Utente non registrato'});
    });

    test('Brano non trovato', async () => {
        const response = await request(app)
            .patch('/api/preferiti/modifica')
            .set('Accept', 'application/json')
            .set('x-access-token', token_2)
            .send({
                idUtente: idUtente_2,
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
            .set('x-access-token', token_2)
            .send({
                idUtente: idUtente_2,
                idBrano: idBrano_2,
                azione: 'rimozione'
            })
        
        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({ message: 'Il brano da rimuovere non è presente'});
    });

    test('Aggiunta effettuata', async () => {
        const response = await request(app)
            .patch('/api/preferiti/modifica')
            .set('Accept', 'application/json')
            .set('x-access-token', token_2)
            .send({
                idUtente: idUtente_2,
                idBrano: idBrano_2,
                azione: 'aggiunta'
            })
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ idBrani: [idBrano_2]});
    });

    test('Aggiunta non valida', async () => {
        const response = await request(app)
            .patch('/api/preferiti/modifica')
            .set('Accept', 'application/json')
            .set('x-access-token', token_2)
            .send({
                idUtente: idUtente_2,
                idBrano: idBrano_2,
                azione: 'aggiunta'
            })
        
        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({ message: 'Il brano da aggiungere è già presente'});
    });

    test('Rimozione effettuata', async () => {
        const response = await request(app)
            .patch('/api/preferiti/modifica')
            .set('Accept', 'application/json')
            .set('x-access-token', token_2)
            .send({
                idUtente: idUtente_2,
                idBrano: idBrano_2,
                azione: 'rimozione'
            })
        
        expect(response.statusCode).toBe(200);

        (response.body.idBrani).forEach((id:any) => {
            if (id.toString() === idBrano_2) {
                fail('Brano non rimosso');
            }
        });
    });
});
