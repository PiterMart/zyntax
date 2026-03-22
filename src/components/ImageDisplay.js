'use client';

import { useState, useEffect } from 'react';
import styles from '../styles/ImageDisplay.module.css';

export default function ImageDisplay() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [isFading, setIsFading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/3dworks/all-images')
      .then((res) => res.json())
      .then((data) => {
        if (data.images && data.images.length > 0) {
          // Shuffle or just use directly
          setImages(data.images);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load images:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setPrevIndex(currentIndex);
      setIsFading(true);
      setCurrentIndex(Math.floor(Math.random() * images.length));
      
      // Cleanup fade state after transition
      setTimeout(() => {
        setIsFading(false);
      }, 1000); // 1 second fade duration matching CSS
      
    }, 2500);

    return () => clearInterval(interval);
  }, [images, currentIndex]);

  if (loading || images.length === 0) {
    return null;
  }

  return (
    <div className={styles.imageDisplayContainer}>
      {/* Previous image fading out */}
      {isFading && prevIndex !== null && (
        <img
          key={`prev-${prevIndex}`}
          src={encodeURI(images[prevIndex])}
          alt="Zyntax 3D Work Fade"
          className={`${styles.displayImage} ${styles.fadeOut}`}
        />
      )}
      
      {/* Current image fading in and establishing layout */}
      <img
        key={`curr-${currentIndex}`}
        src={encodeURI(images[currentIndex])}
        alt="Zyntax 3D Work"
        className={`${styles.displayImage} ${isFading ? styles.fadeIn : ''}`}
      />
    </div>
  );
}
