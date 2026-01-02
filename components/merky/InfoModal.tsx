// components/merky/InfoModal.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaDiscord, FaGithub, FaWifi, FaMusic, FaGamepad } from 'react-icons/fa';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const [active, setActive] = useState(false);

  // Aktifliği isOpen ile senkronize et
  useEffect(() => {
    if (isOpen) {
      // setActive'i bir microtask ile çağırarak cascading render'ı önle
      Promise.resolve().then(() => setActive(true));
      document.body.style.overflow = 'hidden'; // Arka plan kaydırmayı engelle
    } else {
      const timer = setTimeout(() => setActive(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen && !active) return null;

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* --- ARKA PLAN (Backdrop) --- */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* --- MODAL KUTUSU --- */}
      <div 
        className={`
          relative w-full max-w-md bg-[#080808] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)]
          transition-all duration-300 transform
          ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
      >
        
        {/* Dekoratif Efektler */}
        <div className="absolute top-[-50%] right-[-20%] w-[250px] h-[250px] bg-orange-600 rounded-full blur-[90px] opacity-10 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-50%] left-[-20%] w-[250px] h-[250px] bg-[#5865F2] rounded-full blur-[90px] opacity-10 pointer-events-none animate-pulse"></div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

        {/* --- HEADER --- */}
        <div className="relative flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
             <div className="w-2 h-8 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
             <div>
                <h2 className="text-white font-bold tracking-wider uppercase text-sm">Station Info</h2>
                <p className="text-[10px] text-gray-500 tracking-widest uppercase">Art Hive Radio</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* --- İÇERİK --- */}
        <div className="relative p-6 space-y-6">
           
           {/* Üst Kısım: Logo ve Açıklama */}
           <div className="flex items-start gap-5">
              <div className="relative w-20 h-20 shrink-0 bg-gradient-to-br from-gray-800 to-black rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                 <Image 
                    src="/intro-avatar/arjenmarka.png" 
                    alt="Logo" 
                    width={64} 
                    height={64} 
                    className="object-contain opacity-90"
                 />
              </div>
              <div className="space-y-2">
                 <h3 className="text-xl font-light text-white">
                    Merky <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Radio</span>
                 </h3>
                 <p className="text-xs text-gray-400 leading-relaxed">
                    A high-fidelity chiptune & synthwave station designed for gaming, coding, and deep focus sessions.
                 </p>
              </div>
           </div>

           {/* İstatistikler Grid'i (Oyun Envanteri Gibi) */}
           <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <FaWifi size={12} />
                 </div>
                 <div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Bitrate</div>
                    <div className="text-xs text-white font-mono">320 KBPS</div>
                 </div>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <FaMusic size={12} />
                 </div>
                 <div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Frequency</div>
                    <div className="text-xs text-white font-mono">44.1 KHZ</div>
                 </div>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-center gap-3 col-span-2">
                 <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <FaGamepad size={12} />
                 </div>
                 <div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Current Mood</div>
                    <div className="text-xs text-white font-mono">PIXEL GARDEN / CHIPTUNE</div>
                 </div>
              </div>
           </div>

           {/* Bağlantılar */}
           <div className="space-y-2 pt-2">
              <a href="#" className="flex items-center justify-between p-3 rounded-lg bg-[#5865F2]/10 border border-[#5865F2]/20 hover:bg-[#5865F2]/20 transition-colors group">
                 <div className="flex items-center gap-3">
                    <FaDiscord className="text-[#5865F2]" />
                    <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">Join Discord Server</span>
                 </div>
                 <span className="text-[10px] text-[#5865F2] group-hover:text-white transition-colors">Connect -&gt;</span>
              </a>
              
              <a href="#" className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                 <div className="flex items-center gap-3">
                    <FaGithub className="text-white" />
                    <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">Source Code</span>
                 </div>
                 <span className="text-[10px] text-gray-500 group-hover:text-white transition-colors">View -&gt;</span>
              </a>
           </div>

        </div>

        {/* --- FOOTER --- */}
        <div className="p-4 border-t border-white/5 bg-black/40 text-center">
           <p className="text-[9px] text-gray-600 font-mono tracking-widest uppercase">
              Merky Radio v2.4.0 • Build 2025.12.31
           </p>
        </div>

      </div>
    </div>
  );
};

export default InfoModal;