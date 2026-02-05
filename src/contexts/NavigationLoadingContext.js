'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import LoadingScreen from '../components/LoadingScreen';

const NavigationLoadingContext = createContext();

export function NavigationLoadingProvider({ children }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPathnameRef.current = pathname;
      return;
    }

    // Only trigger loading if pathname actually changed
    if (prevPathnameRef.current !== pathname) {
      setIsNavigating(true);
      setShowLoading(true);
      
      // Minimum loading time for smooth transition
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 2000);

      prevPathnameRef.current = pathname;

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleLoadingComplete = () => {
    // Delay hiding loading screen slightly for smooth transition
    setTimeout(() => {
      setShowLoading(false);
    }, 500);
  };

  return (
    <NavigationLoadingContext.Provider value={{ isNavigating }}>
      {showLoading && (
        <LoadingScreen 
          onLoadingComplete={handleLoadingComplete} 
          isLoading={isNavigating} 
        />
      )}
      <div style={{ 
        opacity: showLoading ? 0 : 1, 
        transition: 'opacity 0.5s ease',
        pointerEvents: showLoading ? 'none' : 'auto'
      }}>
        {children}
      </div>
    </NavigationLoadingContext.Provider>
  );
}

export function useNavigationLoading() {
  const context = useContext(NavigationLoadingContext);
  if (!context) {
    throw new Error('useNavigationLoading must be used within NavigationLoadingProvider');
  }
  return context;
}
