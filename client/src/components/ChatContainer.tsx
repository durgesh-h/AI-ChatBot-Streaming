import React, { useEffect, useRef } from 'react';
import type { Message } from '../types/chat';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';

interface ChatContainerProps {
    messages: Message[];
    isTyping: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isTyping }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    return (
        <div className="flex-1 w-full max-w-3xl mx-auto overflow-y-auto custom-scrollbar pb-4 pt-20 px-0">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-50">
                    <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mb-4 shadow-xl" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to AI Chat</h2>
                    <p className="text-gray-500 max-w-sm">
                        Start a conversation with Gemini AI. Responses will stream in real-time.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col">
                    {messages.map((msg, index) => (
                        <ChatMessage key={msg._id || index} message={msg} />
                    ))}
                    {isTyping && <TypingIndicator />}
                    <div ref={bottomRef} />
                </div>
            )}
        </div>
    );
};
