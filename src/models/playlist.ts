import mongoose, { Schema } from 'mongoose';

// TypeScript interface for the playlist object

export interface Playlist {
    utente: Schema.Types.ObjectId,
    listaBrani: Schema.Types.ObjectId[]
}

// MongoDB schema for the playlist object

const schema = new Schema<Playlist>({
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
}, { collection: 'Playlist'});

export default mongoose.model<Playlist>('Playlist', schema);
