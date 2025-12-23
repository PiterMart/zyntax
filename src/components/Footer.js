'use client';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Social</h3>
          <ul className={styles.linkList}>
            <li>
              <a href="https://x.com/Zyntax777" target="_blank" rel="noopener noreferrer" className={styles.link}>
                X / Twitter
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/zyntax_xx" target="_blank" rel="noopener noreferrer" className={styles.link}>
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Contact</h3>
          <ul className={styles.linkList}>
            <li>
              <a href="mailto:pitermartingaste@gmail.com" className={styles.link}>
                Email
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Music</h3>
          <ul className={styles.linkList}>
            <li>
              <a href="https://zyntax.bandcamp.com/" target="_blank" rel="noopener noreferrer" className={styles.link}>
                Bandcamp
              </a>
            </li>
            <li>
              <a href="https://soundcloud.com/zyntax_x" target="_blank" rel="noopener noreferrer" className={styles.link}>
                SoundCloud
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Portfolio</h3>
          <ul className={styles.linkList}>
            <li>
              <a href="https://zyntax.artstation.com/" target="_blank" rel="noopener noreferrer" className={styles.link}>
                ArtStation
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

