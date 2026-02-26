"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import schoolsData from '../../data/schools.json';
import en from '../../messages/en.json';
import kn from '../../messages/kn.json';
import styles from '../styles/Home.module.css';

export default function HomePage() {
    const [search, setSearch] = useState('');
    const [lang] = useState('en'); // Defaulting to EN for demo

    const t = lang === 'en' ? en.Hero : kn.Hero;
    const commonT = lang === 'en' ? en.School : kn.School;

    const filteredSchools = schoolsData.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.kannadaName.includes(search) ||
        s.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <h1>{t.title}</h1>
                <p>{t.subtitle}</p>

                <div className={styles.searchBar}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder={t.searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className={styles.searchBtn}>{t.exploreButton}</button>
                </div>
            </section>

            <section className={styles.grid}>
                {filteredSchools.map(school => (
                    <div key={school.id} className={styles.card}>
                        <img
                            src={school.image}
                            alt={lang === 'en' ? school.name : school.kannadaName}
                            className={styles.cardImg}
                            loading="lazy"
                        />
                        <div className={styles.cardContent}>
                            <h2 className={styles.cardTitle}>
                                {lang === 'en' ? school.name : school.kannadaName}
                            </h2>
                            <div className={styles.cardLocation}>
                                📍 {school.location}
                            </div>

                            <div className={styles.cardTags}>
                                {school.courses.map(course => (
                                    <span key={course} className={styles.tag}>{course}</span>
                                ))}
                            </div>

                            <Link href={`/${school.id}`} className={styles.viewBtn}>
                                {commonT.viewDetails}
                            </Link>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
