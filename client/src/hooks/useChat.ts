import { useState, useCallback, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import type { Message } from '../types/chat';

export const useChat = (socket: Socket | null) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!socket) return;

        socket.on('history', (history: Message[]) => {
            setMessages(history);
        });

        socket.on('ai_stream_start', () => {
            setIsLoading(true);
            setIsTyping(false); // Can double as typing indicator hidden when streaming starts
            setError(null);
            // Append an empty assistant message to start filling
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: '', createdAt: new Date().toISOString() }
            ]);
        });

        socket.on('ai_stream_chunk', (chunk: string) => {
            setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg && lastMsg.role === 'assistant') {
                    return [
                        ...prev.slice(0, -1),
                        { ...lastMsg, content: lastMsg.content + chunk }
                    ];
                }
                return prev;
            });
        });

        socket.on('ai_stream_end', () => {
            setIsLoading(false);
        });

        socket.on('error', (err: string) => {
            setError(err);
            setIsLoading(false);
            setIsTyping(false);
        });

        return () => {
            socket.off('history');
            socket.off('ai_stream_start');
            socket.off('ai_stream_chunk');
            socket.off('ai_stream_end');
            socket.off('error');
        };
    }, [socket]);

    const sendMessage = useCallback((content: string) => {
        if (!socket) return;

        // Optimistic update
        const userMsg: Message = { role: 'user', content, createdAt: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);

        socket.emit('user_message', content);
        setIsLoading(true);
        setIsTyping(true);
    }, [socket]);

    const clearChat = useCallback(() => {
        if (!socket) return;
        socket.emit('clear_chat');
        setMessages([]);
    }, [socket]);

    return { messages, isLoading, error, sendMessage, isTyping, clearChat };
};

