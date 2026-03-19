"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useDraggable } from "../hooks/useDraggable";
import styles from "../styles/HexagonWeapons.module.css";

const headlineLeadText = {
  en: "Military technology",
  es: "Tecnología militar",
};

const headlineRestText = {
  en: "search no more – we have everything you need!",
  es: "No busques más, tenemos todo lo que necesitás.",
};

const clickHereText = {
  en: "click here",
  es: "clic acá",
};

const leaveConfirmMessage = {
  en: "You are about to leave this site. Are you sure you want to proceed?",
  es: "Estás por salir de este sitio. ¿Seguro que querés continuar?",
};

const leaveConfirmYes = { en: "Yes", es: "Sí" };
const leaveConfirmNo = { en: "No", es: "No" };

const WEAPONS_URL = "https://hexagon-weapon-systems.vercel.app/";

const DESKTOP_BREAKPOINT = 769;

export default function HexagonWeapons() {
  const { language } = useLanguage();
  const [isDesktop, setIsDesktop] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const containerRef = useDraggable({
    disabled: !isDesktop,
    dragClassName: styles.dragging
  });

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Dragging logic is optimally handled by useDraggable hook without triggering React re-renders.

  const handleClickHere = (e) => {
    e.preventDefault();
    setShowLeaveModal(true);
  };

  const handleLeaveConfirm = (proceed) => {
    setShowLeaveModal(false);
    if (proceed) window.open(WEAPONS_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={styles.wrapper}>
      <section
        ref={containerRef}
        className={`${styles.container} ${isDesktop ? styles.containerDesktop : ""}`}
      >
        <div className={styles.content}>
          <div className={styles.headline}>
            <span className={styles.headlineLead}>
              {headlineLeadText[language] || headlineLeadText.en}
            </span>
            <span className={styles.headlineRest}>
              {headlineRestText[language] || headlineRestText.en}
            </span>
          </div>
          <a
            href={WEAPONS_URL}
            onClick={handleClickHere}
            className={styles.clickButton}
          >
            {clickHereText[language] || clickHereText.en}
          </a>
        </div>
      </section>

      {showLeaveModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => handleLeaveConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="leave-modal-title"
        >
          <div
            className={styles.modalBox}
            onClick={(e) => e.stopPropagation()}
          >
            <p id="leave-modal-title" className={styles.modalMessage}>
              {leaveConfirmMessage[language] || leaveConfirmMessage.en}
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalButton}
                onClick={() => handleLeaveConfirm(true)}
              >
                {leaveConfirmYes[language] || leaveConfirmYes.en}
              </button>
              <button
                type="button"
                className={styles.modalButton}
                onClick={() => handleLeaveConfirm(false)}
              >
                {leaveConfirmNo[language] || leaveConfirmNo.en}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
