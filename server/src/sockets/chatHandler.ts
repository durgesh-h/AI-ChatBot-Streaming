import { Server, Socket } from 'socket.io';
import Message from '../models/Message';
import Chat from '../models/Chat';
import { streamAIResponse } from '../services/aiService';
import { logger } from '../utils/logger';

export const setupChatHandlers = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        logger.info(`User connected: ${socket.id}`);

        // --- Chat Session Management ---

        // Create a new chat
        socket.on('create_chat', async (title: string = 'New Chat') => {
            try {
                const chat = await Chat.create({ title });
                socket.emit('chat_created', chat);
            } catch (error) {
                logger.error('Error creating chat:', error);
                socket.emit('error', 'Failed to create chat');
            }
        });

        // List all chats
        socket.on('list_chats', async () => {
            try {
                const chats = await Chat.find().sort({ createdAt: -1 });
                socket.emit('chats_list', chats);
            } catch (error) {
                logger.error('Error listing chats:', error);
            }
        });

        // Join a chat (load history)
        socket.on('join_chat', async (chatId: string) => {
            try {
                socket.join(chatId); // Socket.io room for the chat
                const history = await Message.find({ chatId }).sort({ createdAt: 1 }); // Send chronological
                socket.emit('chat_history', { chatId, messages: history });
            } catch (error) {
                logger.error(`Error joining chat ${chatId}:`, error);
                socket.emit('error', 'Failed to load chat history');
            }
        });

        // Delete a chat
        socket.on('delete_chat', async (chatId: string) => {
            try {
                await Chat.findByIdAndDelete(chatId);
                await Message.deleteMany({ chatId });
                socket.emit('chat_deleted', chatId);

                // Refresh list for everyone (simplified)
                const chats = await Chat.find().sort({ createdAt: -1 });
                socket.emit('chats_list', chats);
            } catch (error) {
                logger.error('Error deleting chat:', error);
                socket.emit('error', 'Failed to delete chat');
            }
        });


        // --- Messaging ---

        socket.on('user_message', async ({ chatId, content }: { chatId: string, content: string }) => {
            try {
                if (!chatId) {
                    socket.emit('error', 'Chat ID is required');
                    return;
                }

                // Save user message
                await Message.create({ chatId, role: 'user', content });

                // Start streaming AI response
                socket.emit('ai_stream_start', { chatId });

                let fullAiResponse = "";
                try {
                    const stream = streamAIResponse(content);
                    for await (const chunk of stream) {
                        fullAiResponse += chunk;
                        socket.emit('ai_stream_chunk', { chatId, chunk });
                    }

                    // Save AI message
                    await Message.create({ chatId, role: 'assistant', content: fullAiResponse });
                    socket.emit('ai_stream_end', { chatId });

                } catch (streamError) {
                    logger.error("Streaming error:", streamError);
                    socket.emit('error', "Failed to get AI response");
                    socket.emit('ai_stream_end', { chatId });
                }

            } catch (error) {
                logger.error("Handler error:", error);
                socket.emit('error', "Server error");
            }
        });

        socket.on('disconnect', () => {
            logger.info(`User disconnected: ${socket.id}`);
        });
    });
};
