'use client';
import styles from '../styles/UIOverlay.module.css';
import ResumeSection from './ResumeSection';
import LanguageSelector from './LanguageSelector';

export default function UIOverlay({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        {/* Language Selector - fixed header */}
        <div className={styles.header}>
          <LanguageSelector />
        </div>
        
        <div className={styles.sections}>
          {/* Resume Section - First section */}
          <ResumeSection />
          
          {/* Additional sections will go here */}
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
}

