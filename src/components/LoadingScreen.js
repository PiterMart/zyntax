import { useState, useEffect, useRef } from 'react';
import styles from '../styles/LoadingScreen.module.css';

const FRAME_COUNT = 37;
const FRAMES_PER_SECOND = 15;
const LOGO_BLUR_DURATION = 1200;
const CAT_APPEAR_DELAY = 800;

function getFramePath(i) {
  const padded = String(i).padStart(4, '0');
  return `/catlooplow/CATLOOPlow${padded}.jpg`;
}

const CAT_FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) => getFramePath(i));

export default function LoadingScreen({ onLoadingComplete, isLoading = true }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [showCat, setShowCat] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        onLoadingComplete?.();
      }, 500);
    }
  }, [onLoadingComplete, isLoading]);

  // Preload all cat frames so animation runs smoothly (no freeze on first loop)
  useEffect(() => {
    CAT_FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Start cat fade-in after logo blur-in completes
  useEffect(() => {
    const timer = setTimeout(() => setShowCat(true), LOGO_BLUR_DURATION + CAT_APPEAR_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // Sprite animation - runs immediately, frames preloaded so no freeze
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
    <div className={styles.loadingContainer}>
      <div className={styles.contentRow}>
        <div className={styles.logoContainer}>
          <img
            src="/LOGO ZYNTAX SICK.png"
            alt="NCNL Logo"
            className={`${styles.logo} ${styles.logoBlurIn}`}
          />
        </div>
        <div
          className={`${styles.catContainer} ${showCat ? styles.catVisible : ''}`}
        >
          <img
            src={CAT_FRAMES[frameIndex]}
            alt="Loading..."
            className={styles.catSprite}
          />
        </div>
      </div>
    </div>
  );
} 