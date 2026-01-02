// components/merky/Background.tsx
import React from 'react';

interface BackgroundProps {
  dayImage: string;
  nightImage: string;
  isDayMode: boolean;
}

const Background: React.FC<BackgroundProps> = ({ dayImage, nightImage, isDayMode }) => {
  return (
    // Ana zemin tam siyah
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden select-none">
      
      {/* MANTIK DEĞİŞİKLİĞİ:
         Tek bir div yerine, iki adet <img> kullanıyoruz.
         Böylece resimler arka planda hazır bekliyor, anlık değişimde bekleme yapmıyor.
         'object-cover' sayesinde ekranı tam dolduruyor (boşluk kalmıyor).
      */}

      {/* GECE RESMİ (Altta sabit durur veya üstte belirir) */}
      <img 
        src={nightImage}
        alt="Night"
        draggable={false}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
           // Eğer gündüz moduysa görünmez (0), değilse tam görünür (100)
           isDayMode ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ imageRendering: 'pixelated' }} // Pixel art olduğu için netlik katar
      />

      {/* GÜNDÜZ RESMİ */}
      <img 
        src={dayImage}
        alt="Day"
        draggable={false}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
           isDayMode ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Renk Filtresi (Senin kodundaki mantık) */}
      <div 
        className={`absolute inset-0 transition-colors duration-1000 pointer-events-none ${
          isDayMode ? 'bg-orange-500/10' : 'bg-black/40'
        }`}
      />

      {/* Ekstra Kontrast Perdesi */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
    </div>
  );
};

export default Background;