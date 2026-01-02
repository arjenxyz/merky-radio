// components/merky/OptionsMenu.tsx
import React, { useEffect, useRef } from 'react';
import { FaCog, FaInfoCircle, FaHome, FaCode } from 'react-icons/fa'; // <-- FaCode buraya eklendi

interface OptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenWelcome: () => void;
  onOpenInfo: () => void;
  onOpenDev: () => void; // <-- Bu satır eksikti, eklendi
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ 
  isOpen, 
  onClose, 
  onOpenSettings, 
  onOpenWelcome, 
  onOpenInfo,
  onOpenDev 
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute bottom-12 right-0 w-48 bg-[#1a1a1f] border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-[60] origin-bottom-right animate-[fadeIn_0.2s_ease-out]"
    >
      <div className="py-1">
        
        {/* 1. SETTINGS (Ayarlar) */}
        <button 
          onClick={() => { onOpenSettings(); onClose(); }}
          className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors"
        >
          <FaCog size={14} className="text-gray-400 group-hover:text-white" />
          <span>Settings</span>
        </button>

        {/* 2. SHOW INTRO */}
        <button 
          onClick={() => { onOpenWelcome(); onClose(); }}
          className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors"
        >
          <FaHome size={14} className="text-gray-400 group-hover:text-white" />
          <span>Show Intro</span>
        </button>

        {/* ARA ÇİZGİ */}
        <div className="h-[1px] bg-gray-700 my-1 mx-2 opacity-50"></div>

        {/* 3. DEVELOPER PROFILE (Yeni Eklediğimiz) */}
        <button 
          onClick={() => { onOpenDev(); onClose(); }}
          className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors"
        >
          <FaCode size={14} className="text-gray-400 group-hover:text-white" />
          <span>Developer</span>
        </button>

        {/* 4. ABOUT RADIO */}
        <button 
          onClick={() => { onOpenInfo(); onClose(); }}
          className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors"
        >
          <FaInfoCircle size={14} className="text-gray-400 group-hover:text-white" />
          <span>About Radio</span>
        </button>

      </div>
    </div>
  );
};

export default OptionsMenu;