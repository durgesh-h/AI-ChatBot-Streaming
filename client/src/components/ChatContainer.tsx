import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import type { Message } from '../types/chat';

interface ChatContainerProps {
    messages: Message[];
    isTyping: boolean;
    onSendMessage: (content: string) => void;
    isLoading: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
    messages,
    isTyping,
    onSendMessage,
    isLoading
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                <div className="min-h-full p-4 pb-0 flex flex-col justify-end">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <p>No messages yet.</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <ChatMessage key={msg._id || index} message={msg} />
                        ))
                    )}

                    {isTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Input Area */}
            <div className="relative z-10 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900/90 dark:to-transparent pt-4">
                <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
            </div>
        </div>
    );
};
