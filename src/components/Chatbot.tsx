"use client";
import React, { useState, useEffect } from 'react';
import styles from '../styles/Chatbot.module.css';
import en from '../../messages/en.json';
import kn from '../../messages/kn.json';
import schoolsData from '../../data/schools.json';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [lang, setLang] = useState('en');

    // Listen for language changes from layout
    useEffect(() => {
        const handleLangChange = () => {
            const currentLang = localStorage.getItem('appLang') || 'en';
            setLang(currentLang);
        };
        window.addEventListener('langChange', handleLangChange);
        handleLangChange(); // Initial check
        return () => window.removeEventListener('langChange', handleLangChange);
    }, []);

    const t = lang === 'en' ? en.Chatbot : kn.Chatbot;

    const toggleChat = () => {
        if (!isOpen && messages.length === 0) {
            setMessages([{ id: 1, text: t.greeting, sender: 'bot' }]);
        }
        setIsOpen(!isOpen);
    };

    const findBestSchool = (query) => {
        const q = query.toLowerCase();

        // Deep search logic across various fields
        let bestMatch = null;
        let highestScore = 0;

        for (const school of schoolsData) {
            let score = 0;

            // Location matching
            if (q.includes(school.location.toLowerCase()) || q.includes(school.region.toLowerCase())) score += 3;

            // Course matching
            school.courses.forEach(course => {
                if (q.includes(course.toLowerCase())) score += 2;
            });

            // Name matching
            if (q.includes(school.name.toLowerCase()) || q.includes(school.kannadaName)) score += 2;

            // Concept matching (rural/urban/coastal)
            if (q.includes('rural') && school.description.toLowerCase().includes('rural')) score += 1;
            if (q.includes('coast') && school.region.toLowerCase().includes('coastal')) score += 2;

            if (score > highestScore) {
                highestScore = score;
                bestMatch = school;
            }
        }

        if (bestMatch && highestScore > 0) {
            return lang === 'en'
                ? `Based on your request, I strongly recommend **${bestMatch.name}** located in ${bestMatch.location}. They offer courses like ${bestMatch.courses.join(', ')}.`
                : `ನಿಮ್ಮ ವಿನಂತಿಯ ಆಧಾರದ ಮೇಲೆ, ${bestMatch.location} ನಲ್ಲಿರುವ **${bestMatch.kannadaName}** ಅನ್ನು ನಾನು ಬಲವಾಗಿ ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ. ಅವರು ${bestMatch.courses[0]} ನಂತಹ ಕೋರ್ಸ್‌ಗಳನ್ನು ನೀಡುತ್ತಾರೆ.`;
        }

        return lang === 'en'
            ? "I couldn't find an exact match for that specific request. Could you tell me what city you are in or what subject you want to learn? (e.g., 'Mangaluru', 'Electronics', 'Ballari')"
            : "ಆ ನಿರ್ದಿಷ್ಟ ವಿನಂತಿಗಾಗಿ ನನಗೆ ನಿಖರವಾದ ಹೊಂದಾಣಿಕೆ ಕಂಡುಬಂದಿಲ್ಲ. ನೀವು ಯಾವ ನಗರದಲ್ಲಿರುವಿರಿ ಅಥವಾ ನೀವು ಯಾವ ವಿಷಯವನ್ನು ಕಲಿಯಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ದಯವಿಟ್ಟು ಹೇಳಬಲ್ಲಿರಾ?";
    };

    const handleSend = (text) => {
        if (!text.trim()) return;

        const newMessages = [...messages, { id: Date.now(), text, sender: 'user' }];
        setMessages(newMessages);

        setTimeout(() => {
            const reply = findBestSchool(text);
            setMessages((prev) => [...prev, { id: Date.now() + 1, text: reply, sender: 'bot' }]);
        }, 800);
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
                                {/* Simple markdown bold parsing for the bot response */}
                                {msg.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                            </div>
                        ))}
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
