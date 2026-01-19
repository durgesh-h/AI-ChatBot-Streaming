import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Bot, User, Trash2 } from 'lucide-react';
import type { Message } from '../types/chat';

interface ChatMessageProps {
    message: Message;
    onDelete: (messageId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onDelete }) => {
    const isAi = message.role === 'assistant';
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`group flex gap-4 p-4 md:px-8 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isAi ? 'bg-transparent' : 'bg-transparent'}`}>

            {/* Avatar */}
            <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                ${isAi
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }
            `}>
                {isAi ? <Bot size={18} /> : <User size={18} />}
            </div>

            {/* Content w/ Actions */}
            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {isAi ? 'AI Bot' : 'You'}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ node, inline, className, children, ...props }: any) {
                                return !inline ? (
                                    <div className="relative group/code my-4">
                                        <div className="absolute right-2 top-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                            {/* Could add copy code button here */}
                                        </div>
                                        <pre className="!bg-gray-900/50 !border !border-white/10 !rounded-xl !p-4 overflow-x-auto">
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        </pre>
                                    </div>
                                ) : (
                                    <code className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 font-mono text-sm text-pink-500" {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>

                {/* Footer / Actions */}
                <div className="flex items-center gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Copy Button (AI only) */}
                    {isAi && (
                        <button
                            onClick={handleCopy}
                            className="p-1.5 text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 rounded-md transition-colors"
                            title="Copy response"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    )}

                    {/* Delete Button (Both) */}
                    {message._id && (
                        <button
                            onClick={() => onDelete(message._id!)}
                            className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors"
                            title="Delete message"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
