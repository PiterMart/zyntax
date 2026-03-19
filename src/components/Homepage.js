'use client';

import styles from '../styles/Homepage.module.css';
import WorksInvite from './3dWorksInvite';
import HexagonDevelopment from './hexagondevelopment';
import HexagonWeapons from './HexagonWeapons';

export default function Homepage() {
  return (
    <section className={styles.homepageWrapper}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/bannergothwindowszyntax.png"
        alt="Zyntax Gothic Windows"
        className={styles.bannerImage}
        draggable={false}
      />
      <div className={styles.inviteRow}>
        <WorksInvite />
        <HexagonDevelopment />
        <HexagonWeapons />
      </div>
    </section>
  );
}
