import React from 'react';
import '../styles/globals.css';
import Chatbot from '../components/Chatbot';

// Mock routing since we can't easily set up fully dynamic Next.js i18n without node_modules right now
// For a standard Cloud IDE deployment, the user can toggle this manually or we use a basic state.

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <nav className="navbar">
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-color)' }}>
                        TechSchools Karnataka
                    </div>
                    <div className="navLinks">
                        <a href="/">Home</a>
                        <button className="langToggle" aria-label="Toggle Kannada / English">EN / KN</button>
                    </div>
                </nav>
                <main style={{ minHeight: '80vh' }}>
                    {children}
                </main>

                {/* Global Chatbot Component */}
                <Chatbot lang="en" />

                <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--border-color)', marginTop: '4rem', color: 'var(--text-secondary)' }}>
                    <p>&copy; 2026 Junior Technical Schools Validator - Non-Profit Initiative</p>
                </footer>
            </body>
        </html>
    );
}
