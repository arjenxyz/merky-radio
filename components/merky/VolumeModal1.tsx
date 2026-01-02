// components/merky/VolumeModal.tsx
import React from 'react';
import { FaTimes, FaVolumeUp, FaVolumeDown, FaInfoCircle } from 'react-icons/fa';
import { Scene } from './constants';

interface VolumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterVolume: number;
  setMasterVolume: (val: number) => void;
  musicVolume: number;
  setMusicVolume: (val: number) => void;
  currentScene: Scene;
  ambientVolumes: { [key: string]: number };
  onUpdateAmbientVolume: (id: string, val: number) => void;
  // YENİ: Hangi seslerin aktif olduğunu bilmek için
  activeAmbienceIds: Set<string>;
}

const VolumeModal: React.FC<VolumeModalProps> = ({
  isOpen, onClose,
  masterVolume, setMasterVolume,
  musicVolume, setMusicVolume,
  currentScene, ambientVolumes, onUpdateAmbientVolume,
  activeAmbienceIds
}) => {
  
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-24 right-4 md:right-8 z-[60] animate-fade-in-up origin-bottom-right volume-modal">
      <div className="bg-[#18181b]/95 backdrop-blur-xl border border-white/10 w-[320px] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-sm">Volume Controls</h3>
                <FaInfoCircle className="text-white/30 text-xs" />
            </div>
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                <FaTimes size={14} />
            </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
            
            {/* 1. PERSONAL (MASTER) */}
            <div>
                <h4 className="text-[#8a8a93] text-[10px] font-bold tracking-widest uppercase mb-3">Personal</h4>
                <div className="bg-[#27272a] rounded-xl p-3">
                    <p className="text-white text-xs font-bold mb-2">Main Volume</p>
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

            {/* 2. SHARED (MUSIC) */}
            <div>
                <h4 className="text-[#8a8a93] text-[10px] font-bold tracking-widest uppercase mb-3">Shared</h4>
                <div className="bg-[#27272a] rounded-xl p-3">
                    <p className="text-white text-xs font-bold mb-2">Music Volume</p>
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

            {/* 3. AMBIENT SOUNDS */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[#FF6B4A] text-[10px] font-bold tracking-widest uppercase">
                        Sounds From <span className="text-white">{currentScene.name}</span>
                    </h4>
                </div>

                <div className="bg-[#27272a] rounded-xl p-3 space-y-4">
                    {currentScene.sounds.length === 0 && (
                        <p className="text-white/30 text-xs text-center italic py-2">No ambient sounds.</p>
                    )}

                    {currentScene.sounds.map((sound) => {
                        const val = ambientVolumes[sound.id] ?? 0;
                        // Ses açık mı kontrol et
                        const isActive = activeAmbienceIds.has(sound.id);

                        return (
                            <div key={sound.id} className={`group transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-white/80 text-xs font-medium">
                                        {sound.name} {!isActive && '(Off)'}
                                    </span>
                                    <span className="text-[10px] text-white/30">{Math.round(val * 100)}%</span>
                                </div>
                                <input 
                                    type="range" min="0" max="1" step="0.01" value={val}
                                    onChange={(e) => onUpdateAmbientVolume(sound.id, parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-white/10 rounded-lg cursor-pointer appearance-none"
                                    style={{ accentColor: '#a1a1aa' }}
                                    // Kapalıyken slider ile oynanamasın istiyorsan 'disabled' ekleyebilirsin
                                    // disabled={!isActive} 
                                />
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { bg: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default VolumeModal;