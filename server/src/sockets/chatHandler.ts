import { Server, Socket } from 'socket.io';
import Message from '../models/Message';
import { streamAIResponse } from '../services/aiService';
import { logger } from '../utils/logger';

export const setupChatHandlers = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        logger.info(`User connected: ${socket.id}`);

        // Load recent messages (Bonus)
        socket.on('join', async () => {
            try {
                const history = await Message.find().sort({ createdAt: -1 }).limit(20);
                socket.emit('history', history.reverse());
            } catch (err) {
                logger.error('Error fetching history:', err);
            }
        });

        socket.on('user_message', async (content: string) => {
            try {
                // Save user message
                const userMsg = await Message.create({ role: 'user', content });
                // Emit back to sender (or rely on optimistic UI) - usually we broadcast or just confirm.
                // But for this app, we might just acknowledge.
                // actually for simplicity, we do not need to emit back the user message since client has it.

                // Start streaming AI response
                socket.emit('ai_stream_start');

                let fullAiResponse = "";
                try {
                    const stream = streamAIResponse(content);
                    for await (const chunk of stream) {
                        fullAiResponse += chunk;
                        socket.emit('ai_stream_chunk', chunk);
                    }

                    // Save AI message
                    await Message.create({ role: 'assistant', content: fullAiResponse });
                    socket.emit('ai_stream_end');

                } catch (streamError) {
                    logger.error("Streaming error:", streamError);
                    socket.emit('error', "Failed to get AI response");
                    socket.emit('ai_stream_end'); // Ensure UI unlocks
                }

            } catch (error) {
                logger.error("Handler error:", error);
                socket.emit('error', "Server error");
            }
        });

        socket.on('clear_chat', async () => {
            try {
                await Message.deleteMany({});
                io.emit('history', []); // Clear for everyone
            } catch (error) {
                logger.error("Error clearing chat:", error);
            }
        });

        socket.on('disconnect', () => {
            logger.info(`User disconnected: ${socket.id}`);
        });
    });
};
