import React from 'react';
import classNames from 'classnames';

interface ConnectionStatusProps {
    isConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-gray-200 backdrop-blur-sm shadow-sm">
            <div
                className={classNames(
                    "w-2 h-2 rounded-full transition-colors duration-300",
                    isConnected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                )}
            />
            <span className={classNames("text-xs font-medium", isConnected ? "text-emerald-700" : "text-rose-700")}>
                {isConnected ? "Connected" : "Disconnected"}
            </span>
        </div>
    );
};
