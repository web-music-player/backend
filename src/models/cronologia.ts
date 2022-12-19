import mongoose, { Schema } from 'mongoose';

// TypeScript interface for the song history object

export interface Cronologia {
    id: Schema.Types.ObjectId,
    utente: Schema.Types.ObjectId,
    listaBrani: Schema.Types.ObjectId[]
}

// MongoDB schema for the song history object

const schema = new Schema<Cronologia>({
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
}, { collection: 'Cronologia'});

export default mongoose.model<Cronologia>('Cronologia', schema);
