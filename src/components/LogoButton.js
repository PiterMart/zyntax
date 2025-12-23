'use client';
import Image from 'next/image';
import styles from '../styles/LogoButton.module.css';

export default function LogoButton({ onClick }) {
  return (
    <button className={styles.logoButton} onClick={onClick}>
      <Image
        src="/LOGO ZYNTAX SICK.png"
        alt="Zyntax Logo"
        fill
        className={styles.logoImage}
        priority
      />
    </button>
  );
}

