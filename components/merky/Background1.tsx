// components/merky/Background.tsx
import React from 'react';

interface BackgroundProps {
  dayImage: string;
  nightImage: string;
  isDayMode: boolean;
}

const Background: React.FC<BackgroundProps> = ({ dayImage, nightImage, isDayMode }) => {
  // O anki moda göre doğru resmi seç
  const currentImage = isDayMode ? dayImage : nightImage;

  return (
    // Ana zemin tam siyah
    <div className="absolute inset-0 w-full h-full bg-black" style={{ backgroundColor: '#000000' }}>
      
      {/* Resim Katmanı */}
      <div 
        key={currentImage} 
        className="absolute inset-0 bg-contain bg-center bg-no-repeat animate-fade-in transition-all duration-1000"
        style={{ 
            backgroundImage: `url(${currentImage})`,
            imageRendering: 'pixelated', 
        }}
      />
      
      {/* --- DÜZELTME BURADA YAPILDI --- */}
      {/* Eski kod: bg-blue-900/30 (Lacivert yapıyordu) */}
      {/* Yeni kod: bg-black/50 (Sadece karartır, renk vermez) */}
      <div 
        className={`absolute inset-0 transition-colors duration-1000 ${
          isDayMode ? 'bg-orange-500/10' : 'bg-black/50'
        }`}
      ></div>

      {/* Ekstra kontrast için hafif bir siyah perde daha */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Background;