import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import classNames from 'classnames';
import type { Message } from '../types/chat';
import { User, Sparkles, Copy, Check } from 'lucide-react';

interface ChatMessageProps {
    message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={classNames(
                "flex w-full p-4 md:p-6 gap-4",
                isUser ? "bg-white" : "bg-gray-50 border-y border-gray-100"
            )}
        >
            <div className="flex-shrink-0">
                <div
                    className={classNames(
                        "w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm",
                        isUser ? "bg-indigo-600" : "bg-emerald-600"
                    )}
                >
                    {isUser ? <User size={18} /> : <Sparkles size={18} />}
                </div>
            </div>

            <div className="flex-1 max-w-3xl overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                        {isUser ? "You" : "AI Assistant"}
                    </span>
                    <span className="text-xs text-gray-400">
                        {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                </div>

                <div className="prose prose-sm prose-slate max-w-none prose-p:my-1 prose-headings:my-2 prose-code:text-indigo-600">
                    {isUser ? (
                        <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
                    ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                        </ReactMarkdown>
                    )}
                </div>

                {!isUser && (
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={copyToClipboard}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Copy to clipboard"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

