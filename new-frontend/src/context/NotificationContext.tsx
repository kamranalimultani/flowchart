"use client";

// src/contexts/NotificationContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number;
}

interface NotificationContextType {
    showNotification: (
        type: NotificationType,
        message: string,
        duration?: number
    ) => void;
    showSuccess: (message: string, duration?: number) => void;
    showError: (message: string, duration?: number) => void;
    showWarning: (message: string, duration?: number) => void;
    showInfo: (message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within NotificationProvider");
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = useCallback(
        (type: NotificationType, message: string, duration: number = 5000) => {
            const id = Math.random().toString(36).substr(2, 9);

            setNotifications((prev) => [...prev, { id, type, message, duration }]);

            if (duration > 0) {
                setTimeout(() => {
                    setNotifications((prev) => prev.filter((n) => n.id !== id));
                }, duration);
            }
        },
        []
    );

    const showSuccess = useCallback(
        (message: string, duration?: number) => {
            showNotification("success", message, duration);
        },
        [showNotification]
    );

    const showError = useCallback(
        (message: string, duration?: number) => {
            showNotification("error", message, duration);
        },
        [showNotification]
    );

    const showWarning = useCallback(
        (message: string, duration?: number) => {
            showNotification("warning", message, duration);
        },
        [showNotification]
    );

    const showInfo = useCallback(
        (message: string, duration?: number) => {
            showNotification("info", message, duration);
        },
        [showNotification]
    );

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-5 h-5" />;
            case "error":
                return <XCircle className="w-5 h-5" />;
            case "warning":
                return <AlertCircle className="w-5 h-5" />;
            case "info":
                return <Info className="w-5 h-5" />;
        }
    };

    const getStyles = (type: NotificationType) => {
        switch (type) {
            case "success":
                return "bg-green-50 border-green-200 text-green-800";
            case "error":
                return "bg-red-50 border-red-200 text-red-800";
            case "warning":
                return "bg-yellow-50 border-yellow-200 text-yellow-800";
            case "info":
                return "bg-blue-50 border-blue-200 text-blue-800";
        }
    };

    return (
        <NotificationContext.Provider
            value={{
                showNotification,
                showSuccess,
                showError,
                showWarning,
                showInfo,
            }}
        >
            {children}

            {/* Notification Container */}
            <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-md ">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-right ${getStyles(
                            notification.type
                        )}`}
                    >
                        <div className="flex-shrink-0 mt-0.5">
                            {getIcon(notification.type)}
                        </div>
                        <p className="flex-1 text-sm font-medium">{notification.message}</p>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="flex-shrink-0 hover:opacity-70 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
