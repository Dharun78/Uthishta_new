"use client";
import React, { useState } from 'react';
import styles from '../styles/Chatbot.module.css';
import en from '../../messages/en.json';
import kn from '../../messages/kn.json';

export default function Chatbot({ lang = 'en' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const t = lang === 'en' ? en.Chatbot : kn.Chatbot;

    const toggleChat = () => {
        if (!isOpen && messages.length === 0) {
            setMessages([{ id: 1, text: t.greeting, sender: 'bot' }]);
        }
        setIsOpen(!isOpen);
    };

    const handleSend = (text) => {
        if (!text.trim()) return;

        // Add user message
        const newMessages = [...messages, { id: Date.now(), text, sender: 'user' }];
        setMessages(newMessages);

        // Simulate bot reply based on keywords
        setTimeout(() => {
            let reply = lang === 'en'
                ? "I can help configure a list of schools for that. Let's look at Bangalore Central Junior Technical School."
                : "ಅದಕ್ಕಾಗಿ ನಾನು ಶಾಲೆಗಳ ಪಟ್ಟಿಯನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಲು ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ಬೆಂಗಳೂರು ಕೇಂದ್ರ ಕಿರಿಯ ತಾಂತ್ರಿಕ ಶಾಲೆಯನ್ನು ನೋಡೋಣ.";

            if (text.toLowerCase().includes("rural") || text.toLowerCase().includes("ಗ್ರಾಮೀಣ")) {
                reply = lang === 'en'
                    ? "For rural areas, I highly recommend Hubballi Rural Technical Institute for Agriculture Tech."
                    : "ಗ್ರಾಮೀಣ ಪ್ರದೇಶಗಳಿಗಾಗಿ, ಕೃಷಿ ತಂತ್ರಜ್ಞಾನಕ್ಕಾಗಿ ಹುಬ್ಬಳ್ಳಿ ಗ್ರಾಮೀಣ ತಾಂತ್ರಿಕ ಸಂಸ್ಥೆಯನ್ನು ನಾನು ಹೆಚ್ಚು ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ.";
            }

            setMessages((prev) => [...prev, { id: Date.now() + 1, text: reply, sender: 'bot' }]);
        }, 1000);
    };

    return (
        <div className={styles.wrapper}>
            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.header}>
                        <span>{lang === 'en' ? 'School Guide Bot' : 'ಶಾಲಾ ಮಾರ್ಗದರ್ಶಿ ಬಾಟ್'}</span>
                        <button onClick={toggleChat} className={styles.closeBtn}>&times;</button>
                    </div>

                    <div className={styles.messages}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`${styles.message} ${styles[msg.sender]}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <div className={styles.suggestions}>
                        <button onClick={() => handleSend(t.promptOption1)} className={styles.suggestionBtn}>{t.promptOption1}</button>
                        <button onClick={() => handleSend(t.promptOption2)} className={styles.suggestionBtn}>{t.promptOption2}</button>
                    </div>

                    <form
                        className={styles.inputArea}
                        onSubmit={(e) => {
                            e.preventDefault();
                            const input = e.target.elements.message;
                            handleSend(input.value);
                            input.value = '';
                        }}
                    >
                        <input name="message" type="text" placeholder={t.inputPlaceholder} className={styles.input} autoComplete="off" />
                        <button type="submit" className={styles.sendBtn}>&rarr;</button>
                    </form>
                </div>
            )}

            {!isOpen && (
                <button className={styles.toggleBtn} onClick={toggleChat} aria-label="Open Chat">
                    &#128172;
                </button>
            )}
        </div>
    );
}
