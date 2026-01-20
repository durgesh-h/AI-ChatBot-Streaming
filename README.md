# AI Bot - Future Ready Chat Interface

A professional, production-grade AI Chatbot application featuring real-time streaming, smart personalization, and a minimalist design system. Built with modern web technologies to deliver a premium user experience.

## ✨ Features

### 🧠 Core Intelligence
- **Real-Time AI Streaming**: Experience low-latency, token-by-token responses powered by the Gemini API.
- **Smart Chat Titles**: Chats are automatically renamed based on context using AI summarization.
- **Markdown Support**: Rich text rendering for code blocks, tables, lists, and formatting.

### 🎨 Premium UI/UX
- **Minimalist Design System**: A refined, professional aesthetic with clean typography and subtle interactions.
- **Adaptive Theming**: Seamless Light/Dark mode resilience with persistent preference.
- **Glassmorphism Effects**: Modern translucent UI elements with blur effects.
- **Responsive Layout**: Fully responsive sidebar drawer for mobile devices.
- **Smooth Animations**: Transitions for messages, sidebar, and interactions.

### 🛡️ Privacy & Management
- **Browser-Based Isolation**: Chat sessions are isolated per browser/device for enhanced privacy in shared environments.
- **Session Management**: Create, switch, and delete multiple chat sessions effortlessly.
- **Granular Control**: Delete specific messages or entire chat histories.

### 🛠️ Technical Highlights
- **WebSocket Architecture**: Full duplex communication via Socket.IO.
- **Persistent Storage**: Robust data retention using MongoDB.
- **Device Fingerprinting**: UUID-based device identification for session handling.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4 Optimized)
- **State/Socket**: Custom Hooks
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Server**: Express.js
- **Database**: MongoDB (Mongoose)
- **Communication**: Socket.IO
- **AI Engine**: Google Gemini

## 📂 Project Structure

```bash
/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components (Sidebar, Chat, Input)
│   │   ├── hooks/          # Logic Hooks (useChat, useSocket)
│   │   └── types/          # TypeScript Interfaces
├── server/                 # Node/Express Backend
│   ├── src/
│   │   ├── models/         # Mongoose Schemas (Chat, Message)
│   │   ├── sockets/        # Socket Event Handlers
│   │   └── services/       # AI Integration Services
└── README.md               # Documentation
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Gemini API Key

### 1. Installation
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configuration
Create a `.env` file in the root directory:
```env
# Server
PORT=4000
MONGO_URI=mongodb://localhost:27017/chatbot
GEMINI_API_KEY=your_key_here

# Client
VITE_SOCKET_URL=http://localhost:4000
```

### 3. Launch
Run the application in development mode:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🧪 Quick Test
1.  **Open App**: Confirm it starts in Light Mode with a clean "New Session" button.
2.  **Send Message**: Type "Hello". Watch the streaming response.
3.  **Check Title**: Notice the chat title change from "New Chat" to "Greetings" (or similar).
4.  **New Window**: Open Incognito mode. Verify you get a fresh, isolated workspace.

## 🎥 Demo & Assignment Info
- **Demo Video**: [Watch on Loom](https://www.loom.com/share/dcc4dcc5883c417daa1c8de95f998)

- **Time Spent On the Assignment**: Approx 1.5 days

---
*Built with precision and attention to detail.*
