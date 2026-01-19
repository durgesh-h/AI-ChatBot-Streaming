export interface Chat {
    _id: string;
    title: string;
    createdAt: string;
}

export interface Message {
    _id?: string;
    chatId?: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
}
