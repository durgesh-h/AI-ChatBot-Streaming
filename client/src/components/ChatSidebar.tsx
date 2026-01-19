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
                fixed inset-y-0 left-0 z-30 w-72 bg-gray-50 dark:bg-zinc-950 border-r border-gray-200 dark:border-white/5 backdrop-blur-xl transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">

                    {/* Header / New Chat */}
                    <div className="p-4">
                        <button
                            onClick={onCreateChat}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-white/50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 rounded-xl transition-all duration-200 shadow-sm hover:shadow"
                        >
                            <Plus size={20} />
                            <span className="font-semibold text-sm">New Session</span>
                        </button>
                    </div>

                    {/* Chat List */}
                    <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {chats.map(chat => (
                            <div
                                key={chat._id}
                                onClick={() => onSelectChat(chat._id)}
                                className={`
                                    group relative flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200
                                    ${activeChatId === chat._id
                                        ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-white/10'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900 hover:text-gray-900 dark:hover:text-gray-200'
                                    }
                                `}
                            >
                                <MessageSquare size={18} className={activeChatId === chat._id ? 'text-gray-900 dark:text-white' : 'opacity-40'} />

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
                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md transition-all"
                                    title="Delete Chat"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}

                        {chats.length === 0 && (
                            <div className="text-center text-gray-400 mt-10 text-sm">
                                <p>No history yet.</p>
                                <p>Start a new chat!</p>
                            </div>
                        )}
                    </div>

                    {/* Footer / Mobile Close */}
                    <div className="p-4 border-t border-gray-200 dark:border-white/5 md:hidden">
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
