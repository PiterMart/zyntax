'use client';
import styles from '../styles/UIOverlay.module.css';
import ResumeSection from './ResumeSection';

export default function UIOverlay({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.sections}>
          {/* Resume Section - First section */}
          <ResumeSection onClose={onClose} />
          
          {/* Additional sections will go here */}
        </div>
      </div>
    </div>
  );
}

