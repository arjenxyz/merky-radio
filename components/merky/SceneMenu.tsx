// components/merky/SceneMenu.tsx
import React from 'react';
import Image from 'next/image';
import { Scene } from './constants';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';

interface SceneMenuProps {
  scenes: Scene[];
  currentSceneIndex: number;
  isOpen: boolean;
  onSelectScene: (index: number) => void;
  onClose: () => void;
}

const SceneMenu: React.FC<SceneMenuProps> = ({ scenes, currentSceneIndex, isOpen, onSelectScene, onClose }) => {
  if (!isOpen) return null;

  return (
    // DÜZELTME: 'md:' gibi responsive ön ekleri kaldırdık. 
    // Çünkü parent element zaten 1920x1080'e sabitlendi ve scale ediliyor.
    // 'bottom-28' ile ControlBar'ın üzerine binmesini engelledik.
    <div className="absolute bottom-28 right-8 z-50 w-80 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl animate-fade-in-up origin-bottom-right">
      
      {/* Başlık */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-white font-bold tracking-wider text-sm opacity-80">ATMOSPHERE</h3>
        <button 
          onClick={onClose} 
          className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-white/50 hover:text-white transition-all"
        >
          <FaTimes size={12} />
        </button>
      </div>

      {/* Liste Alanı */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto p-1 no-scrollbar">
        {scenes.map((scene, index) => {
          const isSelected = index === currentSceneIndex;
          
          return (
            <div 
              key={scene.id}
              onClick={() => onSelectScene(index)}
              className={`
                group relative w-full h-32 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300
                ${isSelected 
                  ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] opacity-100' 
                  : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/30'
                }
              `}
            >
              {/* Resim */}
              <Image
                src={scene.bgDay}
                alt={scene.name}
                fill
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ imageRendering: 'pixelated' }}
                sizes="320px"
                priority={index === 0}
              />
              
              {/* Karartma */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${isSelected ? 'opacity-80' : 'opacity-60 group-hover:opacity-40'}`}></div>

              {/* Seçili İkonu */}
              {isSelected && (
                <div className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1 backdrop-blur-sm shadow-sm">
                   <FaCheckCircle size={16} />
                </div>
              )}

              {/* Yazılar */}
              <div className="absolute bottom-3 left-3 right-3">
                 <p className="text-white font-bold text-lg leading-none shadow-black drop-shadow-md">
                   {scene.name}
                 </p>
                 <p className="text-xs text-white/60 mt-1 font-medium tracking-wide">
                   {isSelected ? 'Active' : 'Switch'}
                 </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <style jsx>{`
        .animate-fade-in-up { animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        
        /* SCROLLBAR GİZLEME */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default SceneMenu;