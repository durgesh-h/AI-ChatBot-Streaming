import { Bot } from 'lucide-react';

export const TypingIndicator = () => {
    return (
        <div className="flex gap-4 p-4 md:px-8 mb-2 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Bot size={18} />
            </div>
            <div className="flex items-center gap-1.5 pt-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            </div>
        </div>
    );
};
