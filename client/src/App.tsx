import { useEffect, useState } from 'react';
import { useSocket } from './hooks/useSocket';
import { useChat } from './hooks/useChat';
import { ChatContainer } from './components/ChatContainer';
import { ChatSidebar } from './components/ChatSidebar';
import { Menu, Sun, Moon, MessageSquare } from 'lucide-react';
import { ConnectionStatus } from './components/ConnectionStatus';

function App() {
  const { socket, isConnected } = useSocket();
  const {
    chats,
    activeChatId,
    messages,
    isLoading,
    isTyping,
    error,
    createChat,
    selectChat,
    deleteChat,
    deleteMessage,
    dismissError,
    sendMessage
  } = useChat(socket);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Persist theme
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans overflow-hidden">

      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => { selectChat(id); setIsSidebarOpen(false); }}
        onCreateChat={() => { createChat(); setIsSidebarOpen(false); }}
        onDeleteChat={deleteChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900/50 relative">

        {/* Header */}
        <header className="h-16 border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-4 bg-white/80 dark:bg-black/20 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 md:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              AI Bot
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <ConnectionStatus isConnected={isConnected} />
          </div>
        </header>

        {/* Error Toast */}
        {error && (
          <div className="fixed top-20 right-4 z-50 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <span>{error}</span>
            <button
              onClick={dismissError}
              className="hover:text-red-400"
            >
              <MessageSquare size={14} className="rotate-45" /> {/* Use X icon ideally, reusing for now */}
            </button>
          </div>
        )}

        {/* Chat Area */}
        <main className="flex-1 relative overflow-hidden flex flex-col">
          {activeChatId ? (
            <ChatContainer
              messages={messages}
              isTyping={isTyping}
              onSendMessage={sendMessage}
              isLoading={isLoading}
              onDeleteMessage={deleteMessage}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <MessageSquare className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to AI Bot</h2>
              <p className="max-w-md">Select a conversation from the sidebar or start a new session to begin chatting.</p>
              <button
                onClick={createChat}
                className="mt-6 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-medium hover:scale-105 transition-transform"
              >
                Start Chatting
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
