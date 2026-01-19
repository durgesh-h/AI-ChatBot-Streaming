import { Server, Socket } from 'socket.io';
import Message from '../models/Message';
import Chat from '../models/Chat';
import { streamAIResponse } from '../services/aiService';
import { logger } from '../utils/logger';
import { generateChatTitle } from '../utils/titleGenerator';

export const setupChatHandlers = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        const userId = socket.handshake.query.userId as string;
        logger.info(`User connected: ${socket.id}, userId: ${userId}`);

        // --- Chat Session Management ---

        // Create a new chat
        socket.on('create_chat', async () => {
            try {
                if (!userId) return;
                const chat = await Chat.create({ userId, title: 'New Chat' });
                socket.emit('chat_created', chat);
            } catch (error) {
                logger.error('Error creating chat:', error);
                socket.emit('error', 'Failed to create chat');
            }
        });

        // List chats (User Specific)
        socket.on('list_chats', async () => {
            try {
                if (!userId) return;
                const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
                socket.emit('chats_list', chats);
            } catch (error) {
                logger.error('Error listing chats:', error);
            }
        });

        // Join a chat (load history)
        socket.on('join_chat', async (chatId: string) => {
            try {
                // Verify ownership
                const chat = await Chat.findOne({ _id: chatId, userId });
                if (!chat) {
                    socket.emit('error', 'Chat not found');
                    return;
                }

                socket.join(chatId);
                const history = await Message.find({ chatId }).sort({ createdAt: 1 });
                socket.emit('chat_history', { chatId, messages: history });
            } catch (error) {
                logger.error(`Error joining chat ${chatId}:`, error);
                socket.emit('error', 'Failed to load chat history');
            }
        });

        // Delete a chat (User Specific)
        socket.on('delete_chat', async (chatId: string) => {
            try {
                await Chat.findOneAndDelete({ _id: chatId, userId });
                await Message.deleteMany({ chatId });
                socket.emit('chat_deleted', chatId);

                // Refresh list
                const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
                socket.emit('chats_list', chats);
            } catch (error) {
                logger.error('Error deleting chat:', error);
                socket.emit('error', 'Failed to delete chat');
            }
        });

        // Delete a specific message
        socket.on('delete_message', async ({ messageId, chatId }: { messageId: string, chatId: string }) => {
            try {
                // Optional: verify chat ownership first but simplistic for now
                await Message.findByIdAndDelete(messageId);
                io.to(chatId).emit('message_deleted', messageId);
            } catch (error) {
                logger.error('Error deleting message:', error);
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
                const userMsg = await Message.create({ chatId, role: 'user', content });

                // Check if we need to rename the chat (if it's the first message or title is New Chat)
                // Optimization: checking message count is one way, or just check title.
                const chat = await Chat.findById(chatId);
                if (chat && chat.title === 'New Chat') {
                    // Generate title async
                    generateChatTitle(content).then(async (newTitle) => {
                        chat.title = newTitle;
                        await chat.save();
                        // Notify client of title update
                        // We can emit 'chats_list' again OR a specific 'chat_updated' event
                        // Let's just emit 'chat_updated' to be efficient or re-emit list
                        const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
                        socket.emit('chats_list', chats); // easiest for now
                    });
                }

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
