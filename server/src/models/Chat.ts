import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
    title: string;
    createdAt: Date;
}

const chatSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        default: 'New Chat'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<IChat>('Chat', chatSchema);
