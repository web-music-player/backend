const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User model

module.exports = mongoose.model('Utente', new Schema({
    email: String,
    tipoAccount: {
        type: String,
        enum : ['standard','creator']
    }
}, { collection: 'Utente'}));
