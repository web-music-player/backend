import mongoose, { Schema} from 'mongoose';

// Enum for the account types

enum tipoAccountEnum {
    standard = "standard",
    creator = "creator"
};

// TypeScript interface for the user object

interface Utente {
    email: String,
    password: String,
    tipoAccount: tipoAccountEnum
}

// MongoDB schema for the user object

const schema = new Schema<Utente>({
    email: { type: String, required: true },
    password: { type: String, required: true},
    tipoAccount: { type: String, required: true}
}, { collection: 'Utente'});

module.exports = mongoose.model<Utente>('Utente', schema);
  