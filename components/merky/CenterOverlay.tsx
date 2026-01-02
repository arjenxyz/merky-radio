// components/merky/CenterOverlay.tsx
import React from 'react';

interface CenterOverlayProps {
  isPlaying: boolean;
  isVisible: boolean;
}

const CenterOverlay: React.FC<CenterOverlayProps> = ({ isPlaying, isVisible }) => {
  return (
    <div 
      className={`
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        text-center z-10 flex flex-col items-center w-full px-4
        transition-all duration-1000 ease-in-out
        ${isVisible ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-95 pointer-events-none'}
      `}
    >
        
        {/* 1. ANA MARKA: MERKY */}
        {/* DÜZELTME: 
            - 'text-[140px]' kaldırıldı.
            - 'fontSize: clamp(...)' eklendi. Ekran küçülünce font 50px'e kadar düşer, büyüyünce 160px olur.
            - 'whiteSpace: nowrap' eklendi. Asla alt satıra geçmez.
        */}
        <div className="animate-float w-full flex justify-center">
          <h1 
            className="leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFA366] to-[#FF7626] tracking-tighter drop-shadow-2xl select-none animate-fade-in-scale"
            style={{ 
                fontSize: 'clamp(50px, 12vw, 160px)', 
                whiteSpace: 'nowrap'
            }}
          >
            M E R K Y
          </h1>
        </div>
        
        {/* 2. ALT KİMLİK: ART HIVE */}
        <h2 
            className="text-white/90 font-bold tracking-[0.8em] mt-2 mb-6 drop-shadow-[0_0_5px_rgba(255,118,38,0.5)] select-none animate-slide-up" 
            style={{ 
                fontSize: 'clamp(18px, 3vw, 30px)', // Mobilde 18px, Masaüstünde 30px
                whiteSpace: 'nowrap',
                animationDelay: '0.2s' 
            }}
        >
           ART HIVE
        </h2>

        {/* SÜS: Uzayan Turuncu Çizgi */}
        <div 
          className="h-[2px] bg-gradient-to-r from-transparent via-[#FF7626] to-transparent mb-6 opacity-80 animate-expand"
          style={{ animationDelay: '0.4s' }}
        ></div>

        {/* 3. DURUM METNİ */}
        <p 
          className="text-white/70 tracking-[0.4em] uppercase font-medium drop-shadow-[0_0_2px_#FF7626] animate-pulse-slow"
          style={{ 
            fontSize: 'clamp(10px, 1.5vw, 16px)', // Mobilde çok küçülüp kaybolmasını engeller
            whiteSpace: 'nowrap',
            animationDelay: '0.6s' 
          }}
        >
          {isPlaying ? "Live Station • Focus Mode" : "Click Anywhere to Start"}
        </p>

        {/* --- CSS ANİMASYONLARI (Senin Kodunla Aynı) --- */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in-scale {
            animation: fadeInScale 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          }

          @keyframes slideUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up {
            opacity: 0; /* Başlangıçta gizli */
            animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          }

          @keyframes expandWidth {
            0% { width: 0; opacity: 0; }
            100% { width: clamp(50px, 10vw, 4rem); opacity: 0.8; } /* Çizgi uzunluğu da responsive oldu */
          }
          .animate-expand {
            width: 0;
            animation: expandWidth 0.8s ease-out forwards;
          }

          @keyframes pulseSlow {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; text-shadow: 0 0 8px rgba(255, 118, 38, 0.6); }
          }
          .animate-pulse-slow {
            animation: pulseSlow 3s ease-in-out infinite;
          }
        `}</style>
    </div>
  );
};

export default CenterOverlay;