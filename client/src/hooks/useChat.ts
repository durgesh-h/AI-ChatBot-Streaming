import { useState, useCallback, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import type { Message, Chat } from '../types/chat';

export const useChat = (socket: Socket | null) => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!socket) return;

        // Initialize: List chats
        socket.emit('list_chats');

        // Listeners for Chat Sessions
        socket.on('chats_list', (list: Chat[]) => {
            setChats(list);
        });

        socket.on('chat_created', (newChat: Chat) => {
            setChats(prev => [newChat, ...prev]);
            setActiveChatId(newChat._id);
            setMessages([]);
        });

        socket.on('chat_history', ({ chatId, messages }: { chatId: string, messages: Message[] }) => {
            if (chatId === activeChatId) {
                setMessages(messages);
            }
        });

        socket.on('chat_deleted', (deletedChatId: string) => {
            setChats(prev => prev.filter(c => c._id !== deletedChatId));
            if (activeChatId === deletedChatId) {
                setActiveChatId(null);
                setMessages([]);
            }
        });

        // Listener for Message Deletion (Specific)
        socket.on('message_deleted', (messageId: string) => {
            setMessages(prev => prev.filter(m => m._id !== messageId));
        });

        // Listeners for Messages/Streaming
        socket.on('ai_stream_start', ({ chatId }) => {
            if (chatId !== activeChatId) return;
            setIsLoading(true);
            // Keep isTyping TRUE until first chunk arrives
            setError(null);

            // Append empty message for streaming
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: '', createdAt: new Date().toISOString() }
            ]);
        });

        socket.on('ai_stream_chunk', ({ chatId, chunk }) => {
            if (chatId !== activeChatId) return;

            // First chunk received: stop typing indicator
            setIsTyping(false);

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

        socket.on('ai_stream_end', ({ chatId }) => {
            if (chatId !== activeChatId) return;
            setIsLoading(false);
            setIsTyping(false); // Ensure it's off
        });

        socket.on('error', (err: string) => {
            setError(err);
            setIsLoading(false);
            setIsTyping(false);
        });

        // Connection error handling?
        socket.on('connect_error', () => {
            setError("Connection failed. Retrying...");
        });

        return () => {
            socket.off('chats_list');
            socket.off('chat_created');
            socket.off('chat_history');
            socket.off('chat_deleted');
            socket.off('message_deleted');
            socket.off('ai_stream_start');
            socket.off('ai_stream_chunk');
            socket.off('ai_stream_end');
            socket.off('error');
            socket.off('connect_error');
        };
    }, [socket, activeChatId]);

    const createChat = useCallback(() => {
        if (!socket) return;
        socket.emit('create_chat', 'New Chat');
    }, [socket]);

    const selectChat = useCallback((chatId: string) => {
        if (!socket) return;
        setActiveChatId(chatId);
        setMessages([]);
        setIsLoading(true);
        socket.emit('join_chat', chatId);
        setIsLoading(false);
    }, [socket]);

    const deleteChat = useCallback((chatId: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!socket) return;
        if (confirm('Delete this chat?')) {
            socket.emit('delete_chat', chatId);
        }
    }, [socket]);

    // New: Delete specific message
    const deleteMessage = useCallback((messageId: string) => {
        if (!socket) return;
        socket.emit('delete_message', { messageId, chatId: activeChatId });
    }, [socket, activeChatId]);

    const sendMessage = useCallback((content: string) => {
        if (!socket) return;

        if (!activeChatId) {
            setError("Please select or create a chat first.");
            return;
        }

        const userMsg: Message = { chatId: activeChatId, role: 'user', content, createdAt: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);

        socket.emit('user_message', { chatId: activeChatId, content });
        setIsLoading(true);
        setIsTyping(true); // START Typing
    }, [socket, activeChatId]);

    const dismissError = useCallback(() => setError(null), []);

    return {
        chats,
        activeChatId,
        messages,
        isLoading,
        error,
        isTyping,
        createChat,
        selectChat,
        deleteChat,
        deleteMessage,
        sendMessage,
        dismissError
    };
};
