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
            // If no active chat and list is not empty, maybe select first? Or allow empty state.
            // For now, let's keep it null until user selects or creates.
        });

        socket.on('chat_created', (newChat: Chat) => {
            setChats(prev => [newChat, ...prev]);
            setActiveChatId(newChat._id);
            setMessages([]); // New chat has no messages
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

        // Listeners for Messages/Streaming
        socket.on('ai_stream_start', ({ chatId }) => {
            if (chatId !== activeChatId) return; // Ignore if switched
            setIsLoading(true);
            setIsTyping(false);
            setError(null);
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: '', createdAt: new Date().toISOString() }
            ]);
        });

        socket.on('ai_stream_chunk', ({ chatId, chunk }) => {
            if (chatId !== activeChatId) return;
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
        });

        socket.on('error', (err: string) => {
            setError(err);
            setIsLoading(false);
            setIsTyping(false);
        });

        return () => {
            socket.off('chats_list');
            socket.off('chat_created');
            socket.off('chat_history');
            socket.off('chat_deleted');
            socket.off('ai_stream_start');
            socket.off('ai_stream_chunk');
            socket.off('ai_stream_end');
            socket.off('error');
        };
    }, [socket, activeChatId]);

    const createChat = useCallback(() => {
        if (!socket) return;
        socket.emit('create_chat', 'New Chat');
    }, [socket]);

    const selectChat = useCallback((chatId: string) => {
        if (!socket) return;
        setActiveChatId(chatId);
        setMessages([]); // Clear previous while loading
        setIsLoading(true); // Show loading state while fetching history (optional improvement)
        socket.emit('join_chat', chatId);
        // Loading state will be handled by seeing empty messages or we could add specific loading state
        setIsLoading(false);
    }, [socket]);

    const deleteChat = useCallback((chatId: string, e?: React.MouseEvent) => {
        e?.stopPropagation(); // Prevent selection when clicking delete
        if (!socket) return;
        if (confirm('Delete this chat?')) {
            socket.emit('delete_chat', chatId);
        }
    }, [socket]);

    const sendMessage = useCallback((content: string) => {
        if (!socket) return;

        if (!activeChatId) {
            // Error or auto-create? Let's auto-create if needed or block.
            // Better to just error for now, or ensure UI handles it.
            // Actually, if no chat is selected, we should probably create one?
            // Let's assume UI forces chat creation first or we simply emit create_chat then message.
            // For simplicity: block.
            setError("Please select or create a chat first.");
            return;
        }

        // Optimistic update
        const userMsg: Message = { chatId: activeChatId, role: 'user', content, createdAt: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);

        socket.emit('user_message', { chatId: activeChatId, content });
        setIsLoading(true);
        setIsTyping(true);
    }, [socket, activeChatId]);

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
        sendMessage
    };
};
