// components/merky/VolumeModal.tsx
import React from 'react';
import { FaTimes, FaVolumeUp, FaVolumeDown, FaInfoCircle } from 'react-icons/fa';

interface VolumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterVolume: number;
  setMasterVolume: (val: number) => void;
  musicVolume: number;
  setMusicVolume: (val: number) => void;
}

const VolumeModal: React.FC<VolumeModalProps> = ({
  isOpen, onClose,
  masterVolume, setMasterVolume,
  musicVolume, setMusicVolume
}) => {
  
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-24 right-4 md:right-8 z-[60] animate-fade-in-up origin-bottom-right volume-modal">
      <div className="bg-[#18181b]/95 backdrop-blur-xl border border-white/10 w-[300px] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-sm">Volume Mixer</h3>
                <FaInfoCircle className="text-white/30 text-xs" />
            </div>
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                <FaTimes size={14} />
            </button>
        </div>

        {/* CONTENT */}
        <div className="p-5 space-y-6">
            
            {/* 1. MASTER VOLUME */}
            <div>
                <h4 className="text-[#8a8a93] text-[10px] font-bold tracking-widest uppercase mb-3">System</h4>
                <div className="bg-[#27272a] rounded-xl p-3">
                    <p className="text-white text-xs font-bold mb-2">Master Volume</p>
                    <div className="flex items-center gap-3">
                        <FaVolumeDown className="text-white/40 text-xs"/>
                        <input 
                            type="range" min="0" max="1" step="0.01" value={masterVolume}
                            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg cursor-pointer appearance-none"
                            style={{ accentColor: '#ffffff' }}
                        />
                        <FaVolumeUp className="text-white/40 text-xs"/>
                    </div>
                </div>
            </div>

            {/* 2. MUSIC VOLUME */}
            <div>
                <h4 className="text-[#8a8a93] text-[10px] font-bold tracking-widest uppercase mb-3">Audio</h4>
                <div className="bg-[#27272a] rounded-xl p-3">
                    <p className="text-white text-xs font-bold mb-2">Music Level</p>
                    <div className="flex items-center gap-3">
                        <FaVolumeDown className="text-white/40 text-xs"/>
                        <input 
                            type="range" min="0" max="1" step="0.01" value={musicVolume}
                            onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg cursor-pointer appearance-none"
                            style={{ accentColor: '#FF6B4A' }}
                        />
                        <FaVolumeUp className="text-white/40 text-xs"/>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default VolumeModal;