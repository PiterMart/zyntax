"use client";

import { useState, useEffect } from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import LoadingScreen from '../components/LoadingScreen';
import Video from '../components/Video';
import LogoButton from '../components/LogoButton';
import UIOverlay from '../components/UIOverlay';
import LanguageSelector from '../components/LanguageSelector';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [isUIOpen, setIsUIOpen] = useState(false);

  useEffect(() => {
    // Simulate initial content loading
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 1000);

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
    <LanguageProvider>
      <main>
        {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} isLoading={!contentLoaded} />}

        <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease' }}>
          {/* Video background with footer */}
          <Video />
          
          {/* Language Selector - visible when overlay is closed */}
          {!isUIOpen && (
            <div style={{ position: 'fixed', top: '2rem', left: '2rem', zIndex: 1501 }}>
              <LanguageSelector />
            </div>
          )}
          
          {/* Logo button to open UI overlay */}
          {!isUIOpen && <LogoButton onClick={handleLogoClick} />}
          
          {/* UI Overlay on first 100vh */}
          <UIOverlay isOpen={isUIOpen} onClose={handleCloseUI} />
        </div>
      </main>
    </LanguageProvider>
  );
}
