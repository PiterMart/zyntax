'use client';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/LanguageSelector.module.css';

export default function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className={styles.languageSelector}>
      <button
        className={`${styles.languageButton} ${language === 'en' ? styles.active : ''}`}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
      <span className={styles.separator}>/</span>
      <button
        className={`${styles.languageButton} ${language === 'es' ? styles.active : ''}`}
        onClick={() => changeLanguage('es')}
      >
        ES
      </button>
    </div>
  );
}

