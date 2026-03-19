'use client';

import { useEffect, useRef } from 'react';

export function useDraggable(options = {}) {
  const {
    disabled = false,
    cancelSelector,
    dragClassName,
    centerOffset = false
  } = options;

  const elementRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = elementRef.current;
    if (!el || disabled) {
      if (el) el.style.cursor = '';
      return;
    }

    el.style.cursor = 'move';

    const handleMouseDown = (e) => {
      if (cancelSelector && e.target.closest(cancelSelector)) {
        return;
      }
      
      if (e.target.tagName === 'A' || e.target.closest('a') || e.target.tagName === 'BUTTON' || e.target.closest('button')) {
         return;
      }

      e.preventDefault();
      el.style.cursor = 'grabbing';
      el.style.willChange = 'transform';
      if (dragClassName) {
        el.classList.add(dragClassName);
      }

      const startX = e.clientX;
      const startY = e.clientY;
      const currentElementX = positionRef.current.x;
      const currentElementY = positionRef.current.y;

      const handleMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        
        let newX = currentElementX + deltaX;
        let newY = currentElementY + deltaY;

        const elementWidth = el.offsetWidth || 0;
        const elementHeight = el.offsetHeight || 0;
        const maxX = (window.innerWidth - elementWidth) / 2;
        const maxY = (window.innerHeight - elementHeight) / 2;

        newX = Math.max(-maxX, Math.min(newX, maxX));
        newY = Math.max(-maxY, Math.min(newY, maxY));

        positionRef.current = { x: newX, y: newY };

        if (centerOffset) {
          el.style.transform = `translate(calc(-50% + ${newX}px), calc(-50% + ${newY}px))`;
        } else {
          el.style.transform = `translate(${newX}px, ${newY}px)`;
        }
      };

      const handleMouseUp = () => {
        el.style.cursor = 'move';
        el.style.willChange = 'auto';
        if (dragClassName) {
          el.classList.remove(dragClassName);
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    el.addEventListener('mousedown', handleMouseDown);

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
    };
  }, [disabled, cancelSelector, dragClassName, centerOffset]);

  return elementRef;
}
