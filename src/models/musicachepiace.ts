import mongoose, { Schema } from 'mongoose';

// TypeScript interface for the liked music object

export interface MusicaChePiace {
    utente: Schema.Types.ObjectId,
    listaBrani: Schema.Types.ObjectId[]
}

// MongoDB schema for the liked music object

const schema = new Schema<MusicaChePiace>({
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
}, { collection: 'MusicaChePiace'});

export default mongoose.model<MusicaChePiace>('MusicaChePiace', schema);
