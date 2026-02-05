'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '../styles/CatTerminalButton.module.css';

const FRAME_COUNT = 37;
const FRAMES_PER_SECOND = 15;

function getFramePath(i) {
  const padded = String(i).padStart(4, '0');
  return `/catloop/CATLOOP${padded}.png`;
}

const CAT_FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) => getFramePath(i));

export default function CatTerminalButton({ onClick }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const animationRef = useRef(null);

  // Preload all cat frames so animation runs smoothly
  useEffect(() => {
    CAT_FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Sprite animation - runs continuously
  useEffect(() => {
    const msPerFrame = 1000 / FRAMES_PER_SECOND;
    let lastFrame = performance.now();
    const loop = (now) => {
      if (now - lastFrame >= msPerFrame) {
        setFrameIndex((prev) => (prev + 1) % FRAME_COUNT);
        lastFrame = now;
      }
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <button 
      className={styles.catButton}
      onClick={onClick}
      aria-label="Abrir terminal"
    >
      <img
        src={CAT_FRAMES[frameIndex]}
        alt="Abrir terminal"
        className={styles.catSprite}
      />
    </button>
  );
}
