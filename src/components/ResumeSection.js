'use client';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/ResumeSection.module.css';

const resumeContent = {
  en: {
    title: 'Zyntax | Digital Alchemist',
    content: `Based in Buenos Aires, Zyntax is a multidisciplinary "mercenary of the machine" operating at the intersection of high-fidelity 3D design, sound engineering, and full-stack development. With a foundation in traditional oil painting and a career spanning audiovisual direction and music production, Zyntax crafts immersive worlds through a lens of Gothic and Medieval aesthetics.

From coordinating large-scale festival sound systems to architecting complex web environments and directing music videos, their work serves a singular purpose: the manifestation of the unheard and the unseen.

Currently leading AMA.os and Turrxcore Rekords, Zyntax also maintains a residency at Killerdrumzrekords. They are the founder of Fulgor audiovisual agency and the Eternal Glory clothing brand.`
  },
  es: {
    title: 'Zyntax | Digital Alchemist',
    content: `Radicado en Buenos Aires, Zyntax es un "mercenario de la máquina" multidisciplinario que opera en la intersección del diseño 3D de alta fidelidad, la ingeniería de sonido y el desarrollo full-stack. Con bases en la pintura al óleo tradicional y una trayectoria que abarca la dirección audiovisual y la producción musical, Zyntax construye mundos inmersivos bajo una estética gótica y medieval.

Desde la coordinación de sistemas de sonido para festivales hasta la arquitectura de entornos web complejos y la dirección de videoclips, su trabajo persigue un único propósito: la manifestación de lo inaudito y lo invisible.

Actualmente lidera AMA.os y Turrxcore Rekords, además de desempeñarse como DJ residente en Killerdrumzrekords. Es fundador de la agencia audiovisual Fulgor y de la marca de indumentaria Eternal Glory.`
  }
};

export default function ResumeSection() {
  const { language } = useLanguage();
  const content = resumeContent[language] || resumeContent.en;

  return (
    <section className={styles.resumeSection}>
      <h1 className={styles.title}>{content.title}</h1>
      <div className={styles.content}>
        {content.content.split('\n\n').map((paragraph, index) => (
          <p key={index} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

