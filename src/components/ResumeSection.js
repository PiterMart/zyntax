'use client';
import TerminalWindow from './TerminalWindow';

const resumeContent = {
  en: {
    title: 'Zyntax | Multidisciplinary Specialist',
    content: `3D Generalist, Web Developer, and Audio Engineer. A self-sufficient technical mercenary, I bridge the gap between abstract creativity and precise software manipulation to bring complex visions to life. I approach every project with a holistic vision, calculating how the intersection of media affects the human experience.

I operate with passion and measured precision. Because time is the ultimate constraint, I specialize in aggressive prioritization and clear communication. Every role is key to success—let's discuss how I can help yours.`
  },
  es: {
    title: 'Zyntax | Especialista Multidisciplinario',
    content: `Generalista 3D, Desarrollador Web e Ingeniero de Sonido. Como mercenario técnico autosuficiente, acorto la brecha entre la creatividad abstracta y la manipulación precisa de software para materializar visiones complejas. Abordo cada proyecto con una visión holística, calculando cómo la intersección de medios afecta la experiencia humana.

Opero con pasión y precisión medida. Dado que el tiempo es la restricción máxima, me especializo en la priorización agresiva y la comunicación clara. Cada rol es clave para el éxito; hablemos de cómo puedo potenciar el tuyo.`
  }
};

export default function ResumeSection({ onClose }) {
  return (
    <TerminalWindow 
      content={resumeContent} 
      onClose={onClose}
      showCloseButton={true}
      prompt="C:\\>"
    />
  );
}
