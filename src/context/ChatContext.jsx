import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState(() => {
        const saved = localStorage.getItem('bsb_chats');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('bsb_chats', JSON.stringify(chats));
    }, [chats]);

    const sendMessage = (userId, message, sender = 'user') => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMessage = {
            id: Date.now(),
            text: message,
            sender,
            time
        };

        setChats(prev => {
            const userChat = prev[userId] || { messages: [], lastMessage: '', unread: 0, userName: userId };
            return {
                ...prev,
                [userId]: {
                    ...userChat,
                    messages: [...userChat.messages, newMessage],
                    lastMessage: message,
                    unread: sender === 'user' ? userChat.unread + 1 : userChat.unread,
                    userName: userId // In a real app, this would be the customer name
                }
            };
        });
    };

    const markAsRead = (userId) => {
        setChats(prev => {
            if (!prev[userId]) return prev;
            return {
                ...prev,
                [userId]: {
                    ...prev[userId],
                    unread: 0
                }
            };
        });
    };

    const deleteChat = (userId) => {
        setChats(prev => {
            const newChats = { ...prev };
            delete newChats[userId];
            return newChats;
        });
    };

    return (
        <ChatContext.Provider value={{ chats, sendMessage, markAsRead, deleteChat }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
