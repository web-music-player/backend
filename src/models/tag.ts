import mongoose, { Schema } from 'mongoose';

// TypeScript interface for the tag object

export interface Tag {
    nome: string
}

// MongoDB schema for the tag object

const schema = new Schema<Tag>({
    nome: {
        type: String, required: true
    }
}, { collection: 'Tag'});

export default mongoose.model<Tag>('Tag', schema);
  