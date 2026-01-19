import { useEffect, useState } from 'react';
import { useSocket } from './hooks/useSocket';
import { useChat } from './hooks/useChat';
import { ChatContainer } from './components/ChatContainer';
import { ChatInput } from './components/ChatInput';
import { ConnectionStatus } from './components/ConnectionStatus';
import { MessageSquare, Trash2, Moon, Sun } from 'lucide-react';

function App() {
  const { socket, isConnected } = useSocket();
  const { messages, isLoading, error, sendMessage, isTyping, clearChat } = useChat(socket);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-10 flex items-center justify-between px-4 md:px-8 max-w-5xl mx-auto w-full rounded-b-none md:rounded-b-2xl md:top-2 md:shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none">
            <MessageSquare size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">Gemini Chat</h1>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Real-time Streaming</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button
            onClick={clearChat}
            className="p-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600 dark:text-gray-400 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 rounded-lg transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={20} />
          </button>
          <ConnectionStatus isConnected={isConnected} />
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 w-full flex flex-col pt-4 relative">
        <div className="flex-1 w-full overflow-hidden relative flex flex-col pt-16 md:pt-20">
          <ChatContainer messages={messages} isTyping={isTyping} />
        </div>

        {/* Error Toast */}
        {error && (
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-4 z-50">
            Error: {error}
          </div>
        )}

        {/* Input Area */}
        <div className="w-full bg-gradient-to-t from-gray-50 via-gray-50 to-transparent dark:from-gray-900 dark:via-gray-900 pt-10 pb-6 px-4">
          <ChatInput onSend={sendMessage} isLoading={isLoading} disabled={!isConnected} />
        </div>
      </main>
    </div>
  );
}

export default App;
