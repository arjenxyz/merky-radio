// components/merky/DevModal.tsx
import React from 'react';
import Image from 'next/image';
import { FaTimes, FaGithub, FaLinkedin, FaGlobe, FaCode, FaPlaneDeparture, FaMapMarkerAlt, FaTerminal } from 'react-icons/fa';

interface DevModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DevModal: React.FC<DevModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      
      {/* Backdrop: Sinematik karanlık */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* --- THE CARD --- */}
      <div className="relative w-full max-w-[420px] bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-fade-in-up group">
        
        {/* Arka Plan Efektleri (Ambient Glow) */}
        <div className="absolute top-[-20%] right-[-20%] w-[200px] h-[200px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-600/20 transition-all duration-700"></div>
        <div className="absolute bottom-[-20%] left-[-20%] w-[200px] h-[200px] bg-orange-600/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-orange-600/20 transition-all duration-700"></div>
        
        {/* İnce Izgara Deseni */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none"></div>

        {/* HEADER: Technical Header */}
        <div className="relative flex justify-between items-center p-5 border-b border-white/5 bg-white/[0.01]">
            <div className="flex flex-col">
                <span className="text-[9px] font-mono text-gray-500 tracking-[0.2em] uppercase">System Identity</span>
                
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <FaTimes size={12} />
            </button>
        </div>

        {/* BODY: Content */}
        <div className="relative p-6 space-y-6">
            
            {/* 1. KİMLİK BÖLÜMÜ (Yatay Yerleşim) */}
            <div className="flex items-start gap-5">
                {/* Avatar Çerçevesi */}
                <div className="relative shrink-0">
                    <div className="w-20 h-24 rounded-lg overflow-hidden border border-white/10 bg-black shadow-lg relative z-10">
                        <Image 
                           src="/intro-avatar/"
                           alt="Arjen"
                           fill
                           className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                    </div>
                    {/* Arkadaki Dekoratif Çerçeve */}
                    <div className="absolute -top-1 -right-1 w-full h-full border border-white/5 rounded-lg -z-0"></div>
                    <div className="absolute -bottom-1 -left-1 w-full h-full border border-white/5 rounded-lg -z-0"></div>
                </div>

                {/* İsim ve Etiketler */}
                <div className="flex-1 pt-1">
                    <h2 className="text-2xl font-bold text-white tracking-tight leading-none mb-1">Arjen Esen</h2>
                    <p className="text-sm text-gray-400 font-light mb-3">Full Stack Developer</p>
                    
                    {/* Rozetler */}
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1e1e1e] border border-white/10 text-[10px] font-mono text-orange-400">
                           <FaCode size={10} />
                           <span>BUILDER</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-900/10 border border-blue-500/20 text-[10px] font-mono text-blue-400">
                           <FaPlaneDeparture size={10} />
                           <span>STUDENT PILOT</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. TEKNİK VERİ (Grid) */}
            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors group/item">
                    <div className="flex items-center gap-2 mb-1">
                        <FaTerminal size={10} className="text-gray-500 group-hover/item:text-orange-400 transition-colors" />
                        <span className="text-[10px] font-mono text-gray-500 uppercase">Stack</span>
                    </div>
                    <div className="text-xs text-gray-300 font-medium">React, Next.js, TS</div>
                </div>

                <div className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors group/item">
                    <div className="flex items-center gap-2 mb-1">
                        <FaMapMarkerAlt size={10} className="text-gray-500 group-hover/item:text-blue-400 transition-colors" />
                        <span className="text-[10px] font-mono text-gray-500 uppercase">Base</span>
                    </div>
                    <div className="text-xs text-gray-300 font-medium">Istanbul, TR</div>
                </div>
            </div>

            {/* 3. BİYOGRAFİ (Terminal Tarzı) */}
            <div className="relative p-4 rounded-lg bg-black/40 border border-white/10 font-mono text-xs leading-relaxed text-gray-400">
                <span className="text-orange-500 mr-2">➜</span>
                <span className="text-white">Hello world! Hello Sky!</span>
            </div>

            {/* 4. FOOTER ACTIONS */}
            <div className="flex items-center gap-3 pt-2">
                <a 
                   href="https://github.com/ArjenDev"
                   target="_blank" rel="noopener noreferrer"
                   className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-white text-black font-bold text-xs hover:bg-gray-200 transition-colors"
                >
                   <FaGithub size={14} />
                   <span>GitHub</span>
                </a>
                
                <a 
                   href="https://linkedin.com/in/arjen-esen"
                   target="_blank" rel="noopener noreferrer"
                   className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-[#0077b5] text-white font-bold text-xs hover:bg-[#006396] transition-colors"
                >
                   <FaLinkedin size={14} />
                   <span>LinkedIn</span>
                </a>

                <a 
                   href="https://arjenesen.com"
                   target="_blank" rel="noopener noreferrer"
                   className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-[#222] text-white font-bold text-xs hover:bg-[#444] transition-colors"
                >
                   <FaGlobe size={14} />
                   <span>Portfolio</span>
                </a>
            </div>

        </div>

      </div>
    </div>
  );
};

export default DevModal;