import { useEffect } from 'react';
import styles from '../styles/LoadingScreen.module.css';
import AsciiMorphSection from './visual/AsciiMorph/AsciiMorphSection/AsciiMorphSection.js';

export default function LoadingScreen({ onLoadingComplete, isLoading = true }) {
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        onLoadingComplete?.();
      }, 500);
    }
  }, [onLoadingComplete, isLoading]);

  return (
    <div className={styles.loadingContainer}>
      
      <AsciiMorphSection />
    </div>
  );
}