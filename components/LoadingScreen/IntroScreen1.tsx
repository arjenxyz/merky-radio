// components/merky/IntroScreen.tsx
import React from 'react';

const IntroScreen: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      
      {/* Arka Plan Glow Efekti - Daha yumuşak */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-[#5865F2] to-orange-500 rounded-full blur-[140px] opacity-15 pointer-events-none"></div>

      {/* Ana Konteyner */}
      <div className="relative flex items-center gap-12 md:gap-20">
         
         {/* 1. DISCORD TARAFI */}
         <div className="flex flex-col items-center group">
            <div className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
               <svg viewBox="0 0 127 96" className="w-full h-full fill-[#5865F2] drop-shadow-[0_0_30px_rgba(88,101,242,0.6)]">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
               </svg>
            </div>
            <span className="mt-5 text-sm md:text-base font-black tracking-[0.25em] text-[#5865F2]">DISCORD</span>
         </div>

         {/* 2. AYIRICI (X) - Daha belirgin */}
         <div className="flex flex-col items-center justify-center pb-8">
            <span className="text-5xl md:text-6xl font-light text-white/30 select-none">✕</span>
         </div>

         {/* 3. MERKY TARAFI */}
         <div className="flex flex-col items-center group">
            <div className="relative w-32 h-32 md:w-36 md:h-36 bg-gradient-to-br from-orange-400 to-red-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(255,100,0,0.4)] transition-transform duration-500 group-hover:scale-110">
               <span className="text-7xl md:text-8xl font-black text-white leading-none drop-shadow-xl">M</span>
               <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/25 to-transparent rounded-t-[2rem]"></div>
            </div>
            <span className="mt-5 text-sm md:text-base font-black tracking-[0.25em] text-orange-500">MERKY</span>
         </div>

      </div>

      {/* Alt yazı - Daha okunur */}
      <div className="absolute bottom-12 left-0 right-0 text-center">
         <p className="text-white/30 text-xs uppercase tracking-[0.5em] font-semibold animate-pulse">
           Official Activity Loading
         </p>
      </div>
    </div>
  );
};

export default IntroScreen;