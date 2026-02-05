'use client';

import { NavigationLoadingProvider } from '../contexts/NavigationLoadingContext';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function NavigationWrapper({ children }) {
  return (
    <LanguageProvider>
      <NavigationLoadingProvider>
        {children}
      </NavigationLoadingProvider>
    </LanguageProvider>
  );
}
