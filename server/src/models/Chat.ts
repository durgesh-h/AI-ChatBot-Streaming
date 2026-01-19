import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
    userId: string; // Device ID / Session ID
    title: string;
    createdAt: Date;
}

const ChatSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, default: 'New Chat' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IChat>('Chat', ChatSchema);
