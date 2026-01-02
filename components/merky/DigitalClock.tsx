// components/merky/DigitalClock.tsx
import React, { useState, useEffect } from 'react';

const DigitalClock = () => {
  const [time, setTime] = useState({ hours: '00', minutes: '00' });
  const [dateInfo, setDateInfo] = useState({ date: '', day: '' });
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Saat ve Dakika
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      // Tarih Formatı (Örn: 12 OCT)
      const dateStr = now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase();
      // Gün İsmi (Örn: SUNDAY)
      const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

      // Selamlama Mantığı
      const h = now.getHours();
      let greet = 'GOOD EVENING';
      if (h >= 5 && h < 12) greet = 'GOOD MORNING';
      else if (h >= 12 && h < 18) greet = 'GOOD AFTERNOON';

      setTime({ hours, minutes });
      setDateInfo({ date: dateStr, day: dayStr });
      setGreeting(greet);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000); // Saniyelik güncelleme
    return () => clearInterval(timer);
  }, []);

  // Sunucu tarafında render edilmesini engelle (Hydration mismatch fix)
  if (typeof window === "undefined") return null;

  return (
    <div className="absolute top-8 left-8 z-40 select-none animate-fade-in group">
       
       {/* Glass Container - Hover olunca belirginleşir */}
       <div className="flex flex-col items-start p-4 rounded-2xl transition-all duration-500 bg-transparent hover:bg-black/20 hover:backdrop-blur-md border border-transparent hover:border-white/5">
          
          {/* ÜST: Selamlama */}
          <p className="text-[#FF7626] text-[10px] font-bold tracking-[0.3em] mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-y-2 group-hover:translate-y-0">
             {greeting}
          </p>

          {/* ORTA: SAAT */}
          <div className="flex items-baseline leading-none">
            <span 
                className="text-white text-7xl font-bold tracking-tighter drop-shadow-2xl"
                style={{ fontFamily: "'Outfit', sans-serif", fontVariantNumeric: 'tabular-nums' }}
            >
                {time.hours}
            </span>
            
            {/* Yanıp Sönen İki Nokta (Turuncu) */}
            <span className="text-[#FF7626] text-6xl font-light animate-pulse mx-1 -translate-y-1">:</span>
            
            <span 
                className="text-white text-7xl font-bold tracking-tighter drop-shadow-2xl"
                style={{ fontFamily: "'Outfit', sans-serif", fontVariantNumeric: 'tabular-nums' }}
            >
                {time.minutes}
            </span>
          </div>

          {/* ALT: TARİH */}
          <div className="flex items-center gap-3 mt-2 pl-1">
             <span className="text-white/60 text-sm font-medium tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
               {dateInfo.day}
             </span>
             <div className="w-1 h-1 rounded-full bg-[#FF7626]"></div>
             <span className="text-white/90 text-sm font-bold tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
               {dateInfo.date}
             </span>
          </div>

       </div>
    </div>
  );
};

export default DigitalClock;