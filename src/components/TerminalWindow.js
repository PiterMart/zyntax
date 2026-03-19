'use client';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDraggable } from '../hooks/useDraggable';
import styles from '../styles/TerminalWindow.module.css';

export default function TerminalWindow({ content, onClose, showCloseButton = true, prompt = 'C:\\>' }) {
  const { language } = useLanguage();
  const currentContent = content[language] || content.en || content;
  
  // Handle both object format {title, content} and direct string format
  const title = typeof currentContent === 'object' ? currentContent.title : '';
  const textContent = typeof currentContent === 'object' ? currentContent.content : currentContent;
  
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [displayedContent, setDisplayedContent] = useState('');
  const [isActive, setIsActive] = useState(false);
  const sectionRef = useDraggable({
    cancelSelector: `.${styles.closeButton}, .${styles.content}, .${styles.title}`,
    dragClassName: styles.dragging,
    centerOffset: true
  });
  const titleIntervalRef = useRef(null);
  const contentIntervalRef = useRef(null);

  useEffect(() => {
    // Reset displayed text when language or content changes
    setDisplayedTitle('');
    setDisplayedContent('');
    setIsActive(false);
    
    // If element is already visible, restart animation immediately
    const timer = setTimeout(() => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
          setIsActive(true);
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [language, content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isActive) {
            setIsActive(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const titleIndexRef = { current: 0 };
    const contentIndexRef = { current: 0 };

    // Typewriter effect for title (if exists)
    if (title) {
      titleIntervalRef.current = setInterval(() => {
        if (titleIndexRef.current < title.length) {
          setDisplayedTitle(title.slice(0, titleIndexRef.current + 1));
          titleIndexRef.current++;
        } else {
          clearInterval(titleIntervalRef.current);
          // Start content animation after title completes
          contentIntervalRef.current = setInterval(() => {
            if (contentIndexRef.current < textContent.length) {
              setDisplayedContent(textContent.slice(0, contentIndexRef.current + 1));
              contentIndexRef.current++;
            } else {
              clearInterval(contentIntervalRef.current);
            }
          }, 20);
        }
      }, 50);
    } else {
      // No title, start content immediately
      contentIntervalRef.current = setInterval(() => {
        if (contentIndexRef.current < textContent.length) {
          setDisplayedContent(textContent.slice(0, contentIndexRef.current + 1));
          contentIndexRef.current++;
        } else {
          clearInterval(contentIntervalRef.current);
        }
      }, 20);
    }

    return () => {
      if (titleIntervalRef.current) clearInterval(titleIntervalRef.current);
      if (contentIntervalRef.current) clearInterval(contentIntervalRef.current);
    };
  }, [isActive, title, textContent]);

  const paragraphs = displayedContent.split('\n\n').filter(p => p.length > 0);

  // Dragging logic is optimally handled by useDraggable hook without triggering React re-renders.

  return (
    <section 
      ref={sectionRef} 
      className={styles.terminalWindow}
    >
      {showCloseButton && onClose && (
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
      <div className={styles.windowContent}>
        <div className={styles.prompt}>
          <span className={styles.promptText}>{prompt}</span>
        </div>
        {title && (
          <h1 className={styles.title}>
            {displayedTitle}
            {displayedTitle.length < title.length && <span className={styles.cursor}>|</span>}
          </h1>
        )}
        <div className={styles.content}>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              {paragraph}
              {index === paragraphs.length - 1 && 
               displayedContent.length < textContent.length && 
               <span className={styles.cursor}>|</span>}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
