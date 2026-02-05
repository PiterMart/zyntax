"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";
import styles from "../styles/HexagonDevelopment.module.css";

const headlineText = {
  en: "Need an application or webpage?",
  es: "¿Necesitás una aplicación o página web?",
};

const getInContactLinkText = {
  en: "get in contact",
  es: "ponete en contacto",
};

const getInContactSuffixText = {
  en: "with",
  es: "con",
};

const leaveConfirmMessage = {
  en: "You are about to leave this site. Are you sure you want to proceed?",
  es: "Estás por salir de este sitio. ¿Seguro que querés continuar?",
};

const leaveConfirmYes = { en: "Yes", es: "Sí" };
const leaveConfirmNo = { en: "No", es: "No" };

const HEXAGON_URL = "https://hexagon-developments.vercel.app/";

const DESKTOP_BREAKPOINT = 769;

export default function HexagonDevelopment() {
  const { language } = useLanguage();
  const containerRef = useRef(null);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, elementX: 0, elementY: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleMouseDown = (e) => {
    if (!isDesktop) return;
    if (e.target.tagName === "A" || e.target.closest("a")) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      elementX: position.x,
      elementY: position.y,
    };
  };

  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;
      const newX = dragStartRef.current.elementX + deltaX;
      const newY = dragStartRef.current.elementY + deltaY;

      const elementWidth = containerRef.current?.offsetWidth || 0;
      const elementHeight = containerRef.current?.offsetHeight || 0;
      const maxX = (window.innerWidth - elementWidth) / 2;
      const maxY = (window.innerHeight - elementHeight) / 2;

      setPosition({
        x: Math.max(-maxX, Math.min(newX, maxX)),
        y: Math.max(-maxY, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDesktop, isDragging]);

  const containerStyle =
    isDesktop
      ? {
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? "grabbing" : "move",
        }
      : undefined;

  const handleGetInContactClick = (e) => {
    e.preventDefault();
    setShowLeaveModal(true);
  };

  const handleLeaveConfirm = (proceed) => {
    setShowLeaveModal(false);
    if (proceed) window.open(HEXAGON_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={styles.wrapper}>
      <section
        ref={containerRef}
        className={`${styles.container} ${isDesktop ? styles.containerDesktop : ""} ${isDragging ? styles.dragging : ""}`}
        style={containerStyle}
        onMouseDown={handleMouseDown}
      >
        <div className={styles.content}>
          <div className={styles.headline}>
            {headlineText[language] || headlineText.en}
          </div>
          <div className={styles.getInContactWrap}>
            <a
              href={HEXAGON_URL}
              onClick={handleGetInContactClick}
              className={styles.getInContact}
            >
              {getInContactLinkText[language] || getInContactLinkText.en}
            </a>
            {" "}
            <span className={styles.getInContactSuffix}>
              {getInContactSuffixText[language] || getInContactSuffixText.en}
            </span>
          </div>
          <Image
            src="/hexagondevelopomentslogo.svg"
            alt="Hexagon Developments"
            width={420}
            height={455}
            className={styles.logo}
          />
          <div className={styles.labelBlock}>
            <span className={styles.label}>hexagon developments</span>
          </div>
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
