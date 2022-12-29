# Web Music Player

Questa repository contiene il codice di **backend** del progetto Web Music Player. Questa parte del lavoro si concentra sulle API:

- [x] Sviluppo
- [x] Documentazione
- [x] Testing

# Come avviare il progetto

Il progetto si può trovare all'URL [wmp-backend.up.railway.app](wmp-backend.up.railway.app). Se l'host non fosse attivo, è possibile eseguire il progetto in locale in questo modo:

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

Da qui sarà possibile eseguire i test delle varie API tramite software quali **Postman** o **Insomina**. La documentazione del progetto sarà disponibile all'indirizzo ```http://localhost:PORT/api-docs```
