# Real-Time AI Chatbot with Streaming

A production-grade Real-Time AI Chatbot capable of streaming responses token-by-token using Google Gemini API, Socket.IO, and React.

## 🚀 Features

- **Real-time Streaming**: AI responses are streamed token-by-token via WebSockets.
- **Modern UI**: Built with React, Vite, and Tailwind CSS.
- **Message Persistence**: Chat history is saved in MongoDB.
- **Rich Text Support**: Markdown rendering for AI responses.
- **Typing Indicators**: Visual feedback while AI is generating.
- **Responsive Design**: Mobile-friendly interface.
- **Theme Support**: Dark/Light mode toggle.
- **Bonus Features**: Copy message to clipboard, Clear chat history.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Real-time**: Socket.IO Client
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.IO
- **AI**: Google Gemini API

## 📂 Project Structure

```
/root
  ├── client/        # Frontend (React + Vite)
  ├── server/        # Backend (Express + Socket.IO)
  ├── .env.example   # Environment variables template
  └── README.md      # Project documentation
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or ATLAS URI)
- Google Gemini API Key

### 1. Clone & Install
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Configure Environment
Create a `.env` file in the root structure (or inside server/client if preferred, but the project is set up to read from root or defaults).

**Server (.env)**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/chatbot
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```
*Note: Ensure to place the `.env` file where the server can read it, or update `server/src/index.ts` path if needed. Currently `dotenv.config()` is called in server.*

### 3. Run the Application

**Start Backend (Terminal 1)**
```bash
cd server
npm run dev
```

**Start Frontend (Terminal 2)**
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` to chat!

## 🧪 Verification

1. **Connect**: Open the app, check the "Connected" badge (Green).
2. **Chat**: Type a message and send.
3. **Stream**: Watch the AI response stream in real-time.
4. **Persist**: Refresh the page to see saved history.
5. **Theme**: Toggle Dark/Light mode using the moon/sun icon.

## 📝 Known Limitations
- "Clear Chat" clears history globally (simple implementation).
- No user authentication (public chat).

## 🔮 Future Improvements
- User Authentication (Auth0 / Firebase).
- Multiple chat sessions/threads.
- File attachments / Image inputs.
