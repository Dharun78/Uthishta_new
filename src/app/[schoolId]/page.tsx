import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import schoolsData from '../../../data/schools.json';

// In a real Next.js app, this would use fetch or an ORM. For now, it's reading the JSON.
export function generateStaticParams() {
    return schoolsData.map((school) => ({
        schoolId: school.id,
    }));
}

export default function SchoolDetail({ params }) {
    const { schoolId } = params;
    const school = schoolsData.find((s) => s.id === schoolId);

    if (!school) {
        notFound();
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            <Link href="/" style={{ color: 'var(--accent-color)', textDecoration: 'underline', marginBottom: '2rem', display: 'inline-block' }}>
                &larr; Back to Schools
            </Link>

            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
                <img src={school.image} alt={school.name} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
            </div>

            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{school.name}</h1>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 'normal' }}>
                {school.kannadaName}
            </h2>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <span style={{ padding: '0.5rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                    📍 {school.location}
                </span>
                <span style={{ padding: '0.5rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                    🎓 {school.alumniCount} Alumni
                </span>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>About the School</h3>
                <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{school.description}</p>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>{school.kannadaDescription}</p>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Courses Offered / ನೀಡುವ ಕೋರ್ಸ್‌ಗಳು</h3>
                <ul style={{ listStylePosition: 'inside', fontSize: '1.1rem' }}>
                    {school.courses.map(course => (
                        <li key={course} style={{ marginBottom: '0.5rem' }}>{course}</li>
                    ))}
                </ul>
            </div>

            <div style={{ background: 'var(--accent-color)', color: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Join the Alumni Network</h3>
                <p style={{ marginBottom: '1.5rem' }}>Are you a graduate of {school.name}? Connect with your {school.alumniCount} peers by joining our new digital network.</p>
                <button style={{ background: 'white', color: 'var(--accent-color)', padding: '1rem 2rem', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    Register as Alumni
                </button>
            </div>
        </div>
    );
}
