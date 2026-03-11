import React, { useState, useRef, useEffect } from 'react';
import './chatbot.css';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm Bereket's AI assistant. You can ask me about his skills, projects, or experience.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });
            
            if (!res.ok) throw new Error('Network error');
            const data = await res.json();
            
            setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to the server right now. Please try again later.", sender: 'bot' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="chatbot-container">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className="chatbot-window"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="chatbot-header">
                            <div className="chatbot-title">
                                <span>🤖</span> Bereket's AI
                            </div>
                            <button className="chatbot-close" onClick={() => setIsOpen(false)}>×</button>
                        </div>
                        
                        <div className="chatbot-messages">
                            {messages.map((msg, i) => (
                                <div key={i} className={`message-wrapper ${msg.sender}`}>
                                    <div className={`message bubble-${msg.sender}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="message-wrapper bot">
                                    <div className="message bubble-bot typing-indicator">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="chatbot-input-form" onSubmit={handleSend}>
                            <input 
                                type="text" 
                                placeholder="Ask about Bereket..." 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="submit" disabled={!input.trim()}>Send</button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button 
                className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {isOpen ? '💬' : '🤖'}
            </motion.button>
        </div>
    );
};

export default Chatbot;
