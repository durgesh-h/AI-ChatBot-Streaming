import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (content: string) => void;
    isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        onSendMessage(input);
        setInput('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 mb-4">
            <div className={`
                relative flex items-end gap-2 p-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-gray-200 dark:focus-within:ring-zinc-700
            `}>
                {/* Text Area */}
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask AI Bot..."
                    rows={1}
                    className="flex-1 max-h-48 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none py-3 px-2 leading-6"
                    disabled={isLoading}
                />

                {/* Send Button */}
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className={`
                        p-3 rounded-2xl flex items-center justify-center transition-all duration-200
                        ${input.trim() && !isLoading
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-90 transform hover:scale-105'
                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed'
                        }
                    `}
                >
                    {isLoading ? (
                        <Sparkles size={20} className="animate-spin" />
                    ) : (
                        <Send size={20} className={input.trim() ? 'translate-x-0.5' : ''} />
                    )}
                </button>
            </div>

            <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-3">
                AI can make mistakes. Consider checking important information.
            </p>
        </div>
    );
};
