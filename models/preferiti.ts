import mongoose, { Schema } from 'mongoose';

// TypeScript interface for the liked music object

export interface Preferiti {
    id: Schema.Types.ObjectId,
    utente: Schema.Types.ObjectId,
    listaBrani: Schema.Types.ObjectId[]
}

// MongoDB schema for the liked music object

const schema = new Schema<Preferiti>({
    utente: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Utente'
    },
    listaBrani: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: 'Brano'
    }
}, { collection: 'Preferiti'});

export default mongoose.model<Preferiti>('Preferiti', schema);
