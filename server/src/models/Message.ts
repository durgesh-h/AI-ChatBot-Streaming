import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
    role: 'user' | 'assistant';
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema = new Schema({
    role: { type: String, required: true, enum: ['user', 'assistant'] },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>('Message', MessageSchema);
