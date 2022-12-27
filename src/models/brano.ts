import mongoose, { Schema } from 'mongoose';

// TypeScript interface for the song object

export interface Brano {
    id: Schema.Types.ObjectId,
    nome: String,
    artista: Schema.Types.ObjectId,
    durata: number,
    tags: string[]
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
        type: [String],
        required: false,
        ref: 'Tag'
    }
}, { collection: 'Brano'});

schema.index({ nome: 'text', tags: 'text'});

export default mongoose.model<Brano>('Brano', schema);
