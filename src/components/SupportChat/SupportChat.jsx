import React, { useState, useEffect, useRef } from 'react';
import { FaHeadset, FaPaperPlane, FaTimes, FaCircle } from 'react-icons/fa';
import { useChat } from '../../context/ChatContext';
import './SupportChat.css';

const SupportChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const { chats, sendMessage } = useChat();
    const chatEndRef = useRef(null);

    // Simulated userId for the session
    const [userId] = useState(() => {
        const saved = localStorage.getItem('bsb_user_id');
        if (saved) return saved;
        const newId = 'Mijoz_' + Math.floor(Math.random() * 9000 + 1000);
        localStorage.setItem('bsb_user_id', newId);
        return newId;
    });

    const activeChat = chats[userId] || { messages: [] };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [activeChat.messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        sendMessage(userId, message, 'user');
        setMessage('');

        // Provide a first auto-reply if it's the first message or after some time
        if (activeChat.messages.length === 0) {
            setTimeout(() => {
                sendMessage(userId, "Xabaringiz admin panelga yuborildi. Tez orada javob qaytaramiz! 😊", 'admin');
            }, 1000);
        }
    };

    return (
        <div className="support-chat-container">
            {/* Trigger Button */}
            <button className={`support-trigger ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
                <div className="support-icon-wrapper">
                    <FaHeadset />
                    <span className="online-indicator"><FaCircle /></span>
                </div>
                <span>Admin bilan aloqa</span>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="support-window">
                    <div className="support-header">
                        <div className="admin-status">
                            <div className="admin-avatar">
                                <FaHeadset />
                                <span className="status-dot"></span>
                            </div>
                            <div className="admin-info">
                                <h4>Support Admin</h4>
                                <span>Online</span>
                            </div>
                        </div>
                        <button className="close-support" onClick={() => setIsOpen(false)}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="chat-messages">
                        {activeChat.messages.length === 0 && (
                            <div className="message-bubble admin">
                                <p>Salom! Savolingiz bormi? Admin panelga to'g'ridan-to'g'ri yozishingiz mumkin.</p>
                                <span className="msg-time">Tizim</span>
                            </div>
                        )}
                        {activeChat.messages.map((msg) => (
                            <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                                <p>{msg.text}</p>
                                <span className="msg-time">{msg.time}</span>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <form className="chat-input-area" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Xabarni yozing..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit" className="send-msg-btn">
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SupportChat;
