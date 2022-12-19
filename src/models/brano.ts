import mongoose, { Schema } from 'mongoose';

// TypeScript interface for the song object

export interface Brano {
    nome: String,
    artista: Schema.Types.ObjectId,
    durata: number,
    tags?: Schema.Types.ObjectId[]
}

// MongoDB schema for the song object

const schema = new Schema<Brano>({
    nome: { 
        type: String,
        required: true
    },
    artista: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Utente'
    },
    durata: { 
        type: Number,
        required: true
    },
    tags: { 
        type: [Schema.Types.ObjectId],
        required: false,
        ref: 'Tag'
    }
}, { collection: 'Brano'});

export default mongoose.model<Brano>('Brano', schema);
