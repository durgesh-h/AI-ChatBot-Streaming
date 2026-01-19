import React from 'react';
import { Plus, MessageSquare, Trash2, X } from 'lucide-react';
import type { Chat } from '../types/chat';

interface ChatSidebarProps {
    chats: Chat[];
    activeChatId: string | null;
    onSelectChat: (chatId: string) => void;
    onCreateChat: () => void;
    onDeleteChat: (chatId: string, e: React.MouseEvent) => void;
    isOpen: boolean;
    onClose: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
    chats,
    activeChatId,
    onSelectChat,
    onCreateChat,
    onDeleteChat,
    isOpen,
    onClose
}) => {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 z-30 w-72 bg-gray-100 dark:bg-gray-900/95 border-r border-gray-200 dark:border-white/10 backdrop-blur-xl transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">

                    {/* Header / New Chat */}
                    <div className="p-4">
                        <button
                            onClick={onCreateChat}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600/10 hover:bg-cyan-600/20 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 rounded-xl transition-all duration-200 group"
                        >
                            <Plus size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="font-semibold">New Session</span>
                        </button>
                    </div>

                    {/* Chat List */}
                    <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {chats.map(chat => (
                            <div
                                key={chat._id}
                                onClick={() => onSelectChat(chat._id)}
                                className={`
                                    group relative flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200
                                    ${activeChatId === chat._id
                                        ? 'bg-white dark:bg-white/10 text-cyan-700 dark:text-white border border-gray-200 dark:border-white/5 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200 border border-transparent'
                                    }
                                `}
                            >
                                <MessageSquare size={18} className={activeChatId === chat._id ? 'text-cyan-600 dark:text-cyan-400' : 'opacity-50'} />

                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-sm font-medium">
                                        {chat.title || 'Untitled Chat'}
                                    </p>
                                    <p className="text-xs opacity-50 truncate">
                                        {new Date(chat.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <button
                                    onClick={(e) => onDeleteChat(chat._id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all"
                                    title="Delete Chat"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}

                        {chats.length === 0 && (
                            <div className="text-center text-gray-500 mt-10 text-sm">
                                <p>No history yet.</p>
                                <p>Start a new chat!</p>
                            </div>
                        )}
                    </div>

                    {/* Footer / Mobile Close */}
                    <div className="p-4 border-t border-gray-200 dark:border-white/10 md:hidden">
                        <button
                            onClick={onClose}
                            className="w-full flex items-center justify-center gap-2 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <X size={20} />
                            <span>Close Sidebar</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
