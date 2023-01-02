# Web Music Player

Questa repository contiene il codice di **backend** del progetto Web Music Player. Questa parte del lavoro si concentra sulle API:

- [x] Sviluppo
- [x] Documentazione
- [x] Testing

# Come avviare il progetto

Il backend è live all'URL [https://wmp-backend.up.railway.app](https://wmp-backend.up.railway.app). Qui è possibile solamente eseguire le richieste API e visualizzare la documentazione all'indirizzo [https://wmp-backend.up.railway.app/api-docs](https://wmp-backend.up.railway.app/api-docs).

Se il sito dovesse essere offline, è possibile eseguire il progetto localmente in questo modo:

1. Clonare il progetto
2. Eseguire ```cd backend``` per entrare nella cartella
3. Definire un file ```.env``` all'interno del quale definire le seguenti variabili d'ambiente:
```
MONGODB_URI=""
PORT=""
SUPER_SECRET=""
```
1. Eseguire ```npm install``` per installare le librerie del progetto
2. Eseguire ```npm start``` per avviare il programma in locale

Per visualizzare la documentazione in locale è necessario sostituire al nome dell'host ```localhost:${port}``` nel file ```src/app.ts```, riga 34. Da qui sarà possibile eseguire i test delle varie API tramite software quali **Postman** o **Insomina**.
