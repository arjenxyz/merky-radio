// components/merky/LoadingScreen.tsx
'use client';

import React, { useState, useEffect } from 'react';
import IntroScreen from './IntroScreen';

interface LoadingScreenProps {
  onFinished: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinished }) => {
  const [fade, setFade] = useState(false);

  // Başlangıç animasyonu
  useEffect(() => {
    setTimeout(() => setFade(true), 100);
  }, []);

  // Intro'dan sonra bitir
  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(false);
      setTimeout(onFinished, 800);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center font-sans select-none overflow-hidden transition-opacity duration-700 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      <IntroScreen />
    </div>
  );
};

export default LoadingScreen;