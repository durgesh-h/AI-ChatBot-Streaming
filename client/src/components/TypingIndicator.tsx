import React from 'react';

export const TypingIndicator: React.FC = () => {
    return (
        <div className="flex w-full p-4 md:p-6 gap-4 bg-gray-50 border-y border-gray-100">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shadow-sm">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s] mx-0.5" />
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
            </div>
            <div className="flex items-center">
                <span className="text-sm text-gray-500 animate-pulse font-medium">Thinking...</span>
            </div>
        </div>
    );
};
