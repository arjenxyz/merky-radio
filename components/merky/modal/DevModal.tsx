import React from 'react';
import { FaTimes, FaGithub, FaLinkedin, FaGlobe, FaCode, FaPlane, FaTerminal } from 'react-icons/fa';

/**
 * Props for DevModal component.
 */
interface DevModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * DevModal
 * 
 * Modal dialog displaying developer information and social links.
 * Renders only when `isOpen` is true.
 */
const DevModal: React.FC<DevModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      
      {/* 
        UI Layer: Modal Backdrop
        - Covers the entire viewport with a semi-transparent black background.
        - Applies a blur effect to the background.
        - Clicking the backdrop triggers the modal close handler.
      */}
      <div 
        className="absolute inset-0 bg-[#000000]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* 
        UI Layer: Modal Card
        - Contains all modal content.
        - Styled with a dark theme, rounded corners, and drop shadow.
      */}
      <div className="relative w-full max-w-[360px] bg-[#121212] border border-[#333] rounded-2xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] animate-scale-in">
        
        {/* 
          UI Section: Modal Header
          - Displays modal title and close button.
          - Close button triggers the modal close handler.
        */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#222] bg-[#161616]">
            <div className="flex items-center gap-2 text-gray-400">
                <FaTerminal size={12} />
                <span className="text-[10px] font-bold tracking-widest uppercase">Developer Info</span>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#222] text-gray-400 hover:bg-white hover:text-black transition-all duration-300"
            >
              <FaTimes size={12} />
            </button>
        </div>

        {/* 
          UI Section: Modal Body
          - Contains developer profile, bio, and social links.
        */}
        <div className="p-6 space-y-6">
            
            {/* 
              Profile Section
              - Displays developer icon, name, title, and tags.
            */}
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-xl border border-[#333] bg-[#181818] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#555] transition-all duration-300 shadow-sm group">
                    <FaCode size={30} className="group-hover:scale-110 transition-transform"/>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">ArjenDev</h2>
                    <p className="text-sm text-gray-500 font-medium">Full Stack Developer</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#222] border border-[#333] text-[10px] font-bold text-gray-300 uppercase">
                           <FaPlane size={8} /> Aspiring Pilot
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#222] border border-[#333] text-[10px] font-bold text-gray-300 uppercase">
                           <FaCode size={8} /> Coder
                        </span>
                    </div>
                </div>
            </div>

            {/* 
              Bio Section
              - Displays a short developer bio.
            */}
            <div className="text-sm text-gray-400 leading-relaxed border-t border-b border-[#222] py-4 font-mono">
                &gt; Hello World and Hello Sky!
            </div>

            {/* 
              Social Links Section
              - Renders a grid of social media buttons.
            */}
            <div className="grid grid-cols-3 gap-3">
                <SocialButton 
                    href="https://github.com/arjenxyz" 
                    icon={<FaGithub size={14} />} 
                    label="GitHub" 
                />
                <SocialButton 
                    href="https://linkedin.com/in/arjendev" 
                    icon={<FaLinkedin size={14} />} 
                    label="LinkedIn" 
                />
                <SocialButton 
                    href="https://arjenweb.vercel.app/" 
                    icon={<FaGlobe size={14} />} 
                    label="Web" 
                />
            </div>
        </div>
      </div>
    </div>
  );
};

/**
 * SocialButton
 * 
 * Renders a stylized button linking to a social profile.
 * Props:
 * - href: URL to open.
 * - icon: Icon element to display.
 * - label: Text label for the button.
 */
const SocialButton = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
    <a 
        href={href}
        target="_blank" 
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-[#181818] border border-[#222] text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all duration-300 group"
    >
        <span className="group-hover:scale-110 transition-transform duration-300">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
    </a>
);

export default DevModal;