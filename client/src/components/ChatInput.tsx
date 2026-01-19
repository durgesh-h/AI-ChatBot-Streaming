import React, { useState, type KeyboardEvent, useRef, useEffect } from 'react';
import { Send, StopCircle } from 'lucide-react';
import classNames from 'classnames';

interface ChatInputProps {
    onSend: (content: string) => void;
    isLoading: boolean;
    disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, disabled }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [input]);

    const handleSend = () => {
        if (input.trim() && !disabled && !isLoading) {
            onSend(input);
            setInput('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.focus();
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 shadow-sm rounded-t-2xl">
            <div className="relative flex items-end gap-2 p-2 bg-gray-100 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white border border-transparent focus-within:border-indigo-200 transition-all">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    className="flex-1 max-h-[150px] min-h-[24px] bg-transparent border-0 focus:ring-0 p-2 text-gray-900 placeholder:text-gray-400 resize-none overflow-y-auto leading-relaxed"
                    maxLength={1000}
                    disabled={disabled || isLoading}
                    rows={1}
                />

                <div className="mb-1 text-xs text-gray-400 font-mono px-2 select-none">
                    {input.length}/1000
                </div>

                <button
                    onClick={handleSend}
                    disabled={!input.trim() || disabled || isLoading}
                    className={classNames(
                        "p-2 rounded-xl transition-all",
                        input.trim() && !disabled && !isLoading
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                >
                    {isLoading ? (
                        <StopCircle size={20} className="animate-pulse" /> // Placeholder for cancel if implemented
                    ) : (
                        <Send size={20} className={classNames(input.trim() && "ml-0.5")} />
                    )}
                </button>
            </div>
            <div className="text-center mt-2 text-xs text-gray-400">
                AI can make mistakes. Consider checking important information.
            </div>
        </div>
    );
};
