"use client";

import { useMemo, useEffect, useState, useCallback } from "react";

const SYMBOLS = ["+", "-"];

const NUM_ITEMS = 16;
const MIN_VISIBLE = 4;
const MAX_VISIBLE = 10;
const CYCLE_MS_MIN = 350;
const CYCLE_MS_MAX = 950;

type SymbolItem = {
  id: number;
  symbol: string;
  x: number;
  y: number;
  skew: number;
  delay: number;
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createSymbolItem(id: number): SymbolItem {
  return {
    id,
    symbol: pick(SYMBOLS),
    x: randomBetween(2, 90),
    y: randomBetween(5, 92),
    skew: randomBetween(-5, 5),
    delay: randomBetween(0, 300),
  };
}

export default function PlusMinusOverlay() {
  const [mounted, setMounted] = useState(false);
  const [visibleIds, setVisibleIds] = useState<Set<number>>(() => new Set());

  const items = useMemo(() => {
    return Array.from({ length: NUM_ITEMS }, (_, i) => createSymbolItem(i));
  }, []);

  const cycle = useCallback(() => {
    const howMany = Math.floor(randomBetween(MIN_VISIBLE, MAX_VISIBLE + 1));
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setVisibleIds(new Set(shuffled.slice(0, howMany).map((item) => item.id)));
  }, [items]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    cycle();
    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        cycle();
        scheduleNext();
      }, randomBetween(CYCLE_MS_MIN, CYCLE_MS_MAX));
    };
    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [mounted, cycle]);

  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      aria-hidden
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute font-mono font-bold text-red-500 transition-opacity duration-75"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            opacity: visibleIds.has(item.id) ? 1 : 0,
            pointerEvents: "none",
            fontSize: "clamp(2rem, 6vw, 4rem)",
            textShadow: "0 0 16px rgba(239, 68, 68, 0.4)",
            animation: visibleIds.has(item.id)
              ? "glitch-flicker 0.12s steps(2) infinite"
              : "none",
            animationDelay: `${item.delay}ms`,
            ["--glitch-skew" as string]: `${item.skew}deg`,
          }}
        >
          {item.symbol}
        </div>
      ))}
    </div>
  );
}
