// components/merky/LoadingScreen.tsx
'use client';

import React, { useState, useEffect } from 'react';
import IntroScreen from './IntroScreen';

interface LoadingScreenProps {
  onFinished: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinished }) => {
  const [active, setActive] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(false);
      setTimeout(() => {
        setMounted(false);
        onFinished();
      }, 500);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [onFinished]);

  if (!mounted) return null;

  return (
    <div 
      className={`
        fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden
        origin-center transition-all duration-500 ease-in-out
        ${active 
          ? 'opacity-100 scale-y-100' 
          : 'opacity-0 scale-y-0 brightness-150' 
        }
      `}
    >
      {/* DÜZELTME BURADA YAPILDI:
          Eskiden sadece opacity vardı, şimdi 'w-full h-full' ekledik.
          Böylece bu kutu tüm ekranı kaplayacak.
      */}
      <div className={`w-full h-full ${active ? 'opacity-100' : 'opacity-0 duration-200'}`}>
         <IntroScreen />
      </div>
    </div>
  );
};

export default LoadingScreen;