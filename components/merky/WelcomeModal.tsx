// components/merky/WelcomeModal.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaHeart } from 'react-icons/fa'; // FaHeadphones ve FaDiscord kaldırıldı

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [show, setShow] = useState(false);

  // Animasyonlu açılış/kapanış yönetimi
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isOpen) {
      // "set-state-in-effect" hatasını çözmek için:
      // State güncellemesini senkron değil, asenkron (bir sonraki tick) yapıyoruz.
      // Bu, React'in render döngüsünü kırmasını engeller.
      timer = setTimeout(() => setShow(true), 0);
    } else {
      // Kapanırken animasyon süresi kadar (300ms) bekle
      timer = setTimeout(() => setShow(false), 300);
    }

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Eğer kapalıysa ve animasyon da bittiyse (show=false) render etme
  if (!isOpen && !show) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* ARKA PLAN */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* MODAL KUTUSU */}
      <div 
        className={`relative w-full max-w-md bg-[#080808] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 transform ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dekoratif Efektler */}
        <div className="absolute top-[-50%] left-[-20%] w-[300px] h-[300px] bg-[#5865F2] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-[-50%] right-[-20%] w-[300px] h-[300px] bg-orange-600 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

        {/* HEADER */}
        <div className="relative flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
             </div>
             <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
               System Info
             </span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* İÇERİK */}
        <div className="relative p-8 flex flex-col items-center text-center gap-6">
           <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-orange-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <Image 
                src="/intro-avatar/arjenmarka.png" 
                alt="Merky"
                width={96}
                height={96}
                className="relative object-contain drop-shadow-2xl"
              />
           </div>

           <div className="space-y-3">
             <h2 className="text-2xl font-light text-white">
               Welcome to <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Merky Radio</span>
             </h2>
             <p className="text-sm text-gray-400 leading-relaxed font-light">
               Experience high-fidelity lo-fi beats curated for deep focus, relaxation, and coding sessions.
             </p>
           </div>
        </div>

        {/* FOOTER */}
        <div className="relative p-6 border-t border-white/5 bg-black/20">
           <button 
             onClick={onClose}
             className="group relative w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold tracking-widest uppercase text-xs overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
           >
             <span className="relative z-10 flex items-center justify-center gap-2">
               Start Listening <FaHeart className="text-white/80 group-hover:text-white" />
             </span>
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
           </button>
           
           <p className="mt-4 text-[10px] text-center text-gray-600 tracking-wider">
             CODED & DESIGNED BY ARJEN
           </p>
        </div>

      </div>
    </div>
  );
};

export default WelcomeModal;