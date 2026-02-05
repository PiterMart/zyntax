'use client';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const sectionRef = useRef(null);
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

  const handleMouseDown = (e) => {
    // Don't drag if clicking on close button or content text
    const target = e.target;
    if (target.closest(`.${styles.closeButton}`)) {
      return;
    }
    if (target.closest(`.${styles.content}`) || target.closest(`.${styles.title}`)) {
      return; // Don't drag if clicking on content
    }
    
    setIsDragging(true);
    // Store the initial mouse position and current element position
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      elementX: position.x,
      elementY: position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      // Calculate new position based on mouse movement
      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;
      
      const newX = dragStartRef.current.elementX + deltaX;
      const newY = dragStartRef.current.elementY + deltaY;
      
      // Constrain to viewport (accounting for centered positioning)
      const elementWidth = sectionRef.current?.offsetWidth || 0;
      const elementHeight = sectionRef.current?.offsetHeight || 0;
      const maxX = (window.innerWidth - elementWidth) / 2;
      const maxY = (window.innerHeight - elementHeight) / 2;
      
      setPosition({
        x: Math.max(-maxX, Math.min(newX, maxX)),
        y: Math.max(-maxY, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const sectionStyle = {
    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
    cursor: isDragging ? 'grabbing' : 'move'
  };

  return (
    <section 
      ref={sectionRef} 
      className={`${styles.terminalWindow} ${isDragging ? styles.dragging : ''}`}
      style={sectionStyle}
      onMouseDown={handleMouseDown}
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
