import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
    chatId: mongoose.Types.ObjectId;
    role: 'user' | 'assistant';
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema = new Schema({
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
    role: { type: String, required: true, enum: ['user', 'assistant'] },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>('Message', MessageSchema);
