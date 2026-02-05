'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/Section1.module.css';

const sectionContent = {
  en: 'What can I do for you?',
  es: 'En qué puedo ayudarte?'
};

export default function Section1() {
  const { language } = useLanguage();
  const text = sectionContent[language] || sectionContent.en;
  const words = text.split(' ');
  const [visibleWords, setVisibleWords] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Reset visible words when language changes
    setVisibleWords([]);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate words in sequence
            words.forEach((_, index) => {
              setTimeout(() => {
                setVisibleWords((prev) => {
                  if (!prev.includes(index)) {
                    return [...prev, index];
                  }
                  return prev;
                });
              }, index * 150); // 150ms delay between each word
            });
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [text, words.length]);

  return (
    <section ref={sectionRef} className={styles.section1}>
      <p className={styles.text}>
        {words.map((word, index) => (
          <span
            key={index}
            className={`${styles.word} ${
              visibleWords.includes(index) ? styles.visible : ''
            }`}
          >
            {word}
          </span>
        ))}
      </p>
    </section>
  );
}
