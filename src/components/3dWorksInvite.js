'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/3dWorksInvite.module.css';

const words = ['modeling', 'texturing', 'rendering', 'retopology'];

const buttonText = {
  en: 'SEE FILES',
  es: 'VER ARCHIVOS'
};

export default function WorksInvite() {
  const { language } = useLanguage();
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [displayLines, setDisplayLines] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [phase, setPhase] = useState('typing'); // 'typing', 'deleting'
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const waitTimerRef = useRef(null);

  useEffect(() => {
    const handleAnimation = () => {
      if (phase === 'typing') {
        // Typing words line by line
        const currentWord = words[currentWordIndex];
        const currentLine = displayLines[currentWordIndex] || '';
        
        if (currentLine.length < currentWord.length) {
          // Still typing current word
          const newLines = [...displayLines];
          newLines[currentWordIndex] = currentWord.substring(0, currentLine.length + 1);
          setDisplayLines(newLines);
          setTypingSpeed(100);
        } else {
          // Finished typing current word, move to next word
          if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex(prev => prev + 1);
            setTypingSpeed(100);
          } else {
            // All words typed, wait then start deleting
            // Clear any existing timer
            if (waitTimerRef.current) {
              clearTimeout(waitTimerRef.current);
            }
            waitTimerRef.current = setTimeout(() => {
              setPhase('deleting');
              setTypingSpeed(50);
            }, 2000);
          }
        }
      } else if (phase === 'deleting') {
        // Delete all lines character by character
        if (displayLines.length > 0) {
          const newLines = [...displayLines];
          const lastLineIndex = newLines.length - 1;
          
          if (newLines[lastLineIndex].length > 0) {
            // Delete from last line
            newLines[lastLineIndex] = newLines[lastLineIndex].substring(0, newLines[lastLineIndex].length - 1);
          } else {
            // Remove empty line
            newLines.pop();
          }
          
          setDisplayLines(newLines);
          setTypingSpeed(50);
        } else {
          // All deleted, reset and start over
          setDisplayLines([]);
          setCurrentWordIndex(0);
          setPhase('typing');
          setTypingSpeed(100);
        }
      }
    };

    const timer = setTimeout(handleAnimation, typingSpeed);
    return () => {
      clearTimeout(timer);
      if (waitTimerRef.current) {
        clearTimeout(waitTimerRef.current);
      }
    };
  }, [displayLines, currentWordIndex, phase, typingSpeed]);

  const handleCanPlay = () => {
    setVideoLoaded(true);
  };

  const handleError = () => {
    console.error('Error loading video.');
    setVideoLoaded(false);
  };

  const handleMouseDown = (e) => {
    // Don't drag if clicking on button or link
    const target = e.target;
    // Check if clicking on the button link or inside button container
    if (target.tagName === 'A' || target.closest('a')) {
      return;
    }
    
    e.preventDefault();
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
      
      // Constrain to viewport
      const elementWidth = containerRef.current?.offsetWidth || 0;
      const elementHeight = containerRef.current?.offsetHeight || 0;
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
  }, [isDragging, position]);

  const containerStyle = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    cursor: isDragging ? 'grabbing' : 'move'
  };

  return (
    <div className={styles.wrapper}>
      <section 
        ref={containerRef}
        className={`${styles.container} ${isDragging ? styles.dragging : ''}`}
        style={containerStyle}
        onMouseDown={handleMouseDown}
      >
        <div className={styles.headline}>3D SOLUTIONS</div>
        <div className={styles.videoWrapper} onMouseDown={handleMouseDown}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={styles.video}
          onCanPlayThrough={handleCanPlay}
          onError={handleError}
        >
          <source src="/ZyntaxKnightloop_1.mp4" type="video/mp4" />
        </video>
        
        {/* Typewriter text overlapping video */}
        <div className={styles.typewriterText}>
          {displayLines.map((line, index) => (
            <div key={index}>
              {line}
              {index === displayLines.length - 1 && <span className={styles.cursor}>|</span>}
            </div>
          ))}
          {displayLines.length === 0 && <span className={styles.cursor}>|</span>}
        </div>
        
        {/* Button overlay in the middle */}
        <div className={styles.buttonContainer}>
          <Link href="/3dworks" className={styles.button}>
            {buttonText[language] || buttonText.en}
          </Link>
        </div>
      </div>
    </section>
    </div>
  );
}
