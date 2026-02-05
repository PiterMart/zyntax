'use client';

import Link from 'next/link';
import Image from 'next/image';
import LanguageSelector from './LanguageSelector';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <LanguageSelector />
      </div>
      <div className={styles.rightSection}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/z of zyntax.png"
            alt="Zyntax Logo"
            width={180}
            height={180}
            className={styles.logo}
            priority
          />
        </Link>
      </div>
    </nav>
  );
}
