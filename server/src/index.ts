import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { setupChatHandlers } from './sockets/chatHandler';
import { logger } from './utils/logger';

import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Database
connectDB();

// Sockets
setupChatHandlers(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
