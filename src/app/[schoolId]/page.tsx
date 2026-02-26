"use client";
import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import schoolsData from '../../../data/schools.json';
import en from '../../../messages/en.json';
import kn from '../../../messages/kn.json';

export default function SchoolDetail({ params }) {
    const { schoolId } = params;
    const school = schoolsData.find((s) => s.id === schoolId);
    const [lang, setLang] = useState('en');

    useEffect(() => {
        const handleLangChange = () => {
            setLang(localStorage.getItem('appLang') || 'en');
        };
        handleLangChange();
        window.addEventListener('langChange', handleLangChange);
        return () => window.removeEventListener('langChange', handleLangChange);
    }, []);

    if (!school) {
        notFound();
    }

    const commonT = lang === 'en' ? en.School : kn.School;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            <Link href="/" style={{ color: 'var(--accent-color)', textDecoration: 'underline', marginBottom: '2rem', display: 'inline-block' }}>
                &larr; {lang === 'en' ? 'Back to Schools' : 'ಶಾಲೆಗಳಿಗೆ ಹಿಂತಿರುಗಿ'}
            </Link>

            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
                <img
                    src={school.image}
                    alt={lang === 'en' ? school.name : school.kannadaName}
                    style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                />
            </div>

            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                {lang === 'en' ? school.name : school.kannadaName}
            </h1>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 'normal' }}>
                {lang === 'en' ? school.kannadaName : school.name}
            </h2>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <span style={{ padding: '0.5rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                    📍 {school.location}
                </span>
                <span style={{ padding: '0.5rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                    🎓 {school.alumniCount} {lang === 'en' ? 'Alumni' : 'ಹಳೆಯ ವಿದ್ಯಾರ್ಥಿಗಳು'}
                </span>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                    {lang === 'en' ? 'About the School' : 'ಶಾಲೆಯ ಬಗ್ಗೆ'}
                </h3>
                <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                    {lang === 'en' ? school.description : school.kannadaDescription}
                </p>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                    {lang === 'en' ? 'Courses Offered' : 'ನೀಡುವ ಕೋರ್ಸ್‌ಗಳು'}
                </h3>
                <ul style={{ listStylePosition: 'inside', fontSize: '1.1rem' }}>
                    {school.courses.map(course => (
                        <li key={course} style={{ marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>{course}</li>
                    ))}
                </ul>
            </div>

            <div style={{ background: 'var(--accent-color)', color: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{commonT.joinAlumni}</h3>
                <p style={{ marginBottom: '1.5rem' }}>
                    {lang === 'en'
                        ? `Are you a graduate of ${school.name}? Connect with your ${school.alumniCount} peers by joining our new digital network.`
                        : `ನೀವು ${school.kannadaName} ನ ಪದವೀಧರರೇ? ನಮ್ಮ ಹೊಸ ಡಿಜಿಟಲ್ ನೆಟ್‌ವರ್ಕ್‌ಗೆ ಸೇರುವ ಮೂಲಕ ನಿಮ್ಮ ${school.alumniCount} ಗೆಳೆಯರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ.`
                    }
                </p>
                <button style={{ background: 'white', color: 'var(--accent-color)', padding: '1rem 2rem', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                    {lang === 'en' ? 'Register as Alumni' : 'ಹಳೆಯ ವಿದ್ಯಾರ್ಥಿಯಾಗಿ ನೋಂದಾಯಿಸಿ'}
                </button>
            </div>
        </div>
    );
}
