"use client";
import React, { useState, useEffect } from 'react';
import '../styles/globals.css';
import Chatbot from '../components/Chatbot';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [lang, setLang] = useState('en');

    useEffect(() => {
        // Read from localStorage on mount
        const savedLang = localStorage.getItem('appLang') || 'en';
        setLang(savedLang);
    }, []);

    const toggleLanguage = () => {
        const newLang = lang === 'en' ? 'kn' : 'en';
        setLang(newLang);
        localStorage.setItem('appLang', newLang);

        // Dispatch custom event to notify other components (like Chatbot & Homepage)
        window.dispatchEvent(new Event('langChange'));
    };

    return (
        <html lang={lang}>
            <body>
                <nav className="navbar">
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-color)' }}>
                        Vidyalaya - Karnataka JTS
                    </div>
                    <div className="navLinks">
                        <a href="/">Home</a>
                        <button
                            className="langToggle"
                            onClick={toggleLanguage}
                            aria-label="Toggle Kannada / English"
                        >
                            {lang === 'en' ? 'ಕನ್ನಡಕ್ಕೆ ಬದಲಿಸಿ' : 'Switch to English'}
                        </button>
                    </div>
                </nav>

                <main style={{ minHeight: '80vh' }}>
                    {children}
                </main>

                <Chatbot />

                <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--border-color)', marginTop: '4rem', color: 'var(--text-secondary)' }}>
                    <p>&copy; {new Date().getFullYear()} Junior Technical Schools Validator - Non-Profit Initiative</p>
                </footer>
            </body>
        </html>
    );
}
