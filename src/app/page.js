"use client";

import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import Video from '../components/Video';
import LogoButton from '../components/LogoButton';
import UIOverlay from '../components/UIOverlay';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [isUIOpen, setIsUIOpen] = useState(false);

  useEffect(() => {
    // Simulate initial content loading (minimum 5 seconds)
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleLogoClick = () => {
    setIsUIOpen(true);
  };

  const handleCloseUI = () => {
    setIsUIOpen(false);
  };

  return (
    <main>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} isLoading={!contentLoaded} />}

      <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease' }}>
        {/* Video background with footer */}
        <Video>
          {/* Logo button to open UI overlay */}
          {!isUIOpen && <LogoButton onClick={handleLogoClick} />}
          
          {/* UI Overlay on first 100vh */}
          <UIOverlay isOpen={isUIOpen} onClose={handleCloseUI} />
        </Video>
      </div>
    </main>
  );
}
