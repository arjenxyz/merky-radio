import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaDiscord, FaWifi, FaMusic, FaBroadcastTower, FaInfoCircle } from 'react-icons/fa';

interface InfoModalProps {
   isOpen: boolean;
   onClose: () => void;
}

/**
 * InfoModal
 * 
 * Displays detailed information about the Merky Radio station in a modal dialog.
 * Handles modal open/close animation, scroll locking, and keyboard accessibility.
 */
const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
   /**
    * State: Controls the animation state of the modal.
    * `active` remains true during the closing animation to allow for smooth transitions.
    */
   const [active, setActive] = useState(false);

   /**
    * Effect: Handles modal open/close animation, scroll locking, and Escape key accessibility.
    * 
    * - When `isOpen` is true:
    *   - Sets `active` to true (enables modal visibility and animation).
    *   - Locks body scroll to prevent background scrolling.
    * - When `isOpen` is false:
    *   - Waits for the closing animation (300ms) before setting `active` to false (removes modal from DOM).
    *   - Restores body scroll.
    * - Adds a keydown event listener to close the modal when Escape is pressed.
    *   - Cleans up the event listener on unmount or when `isOpen` changes.
    */
   useEffect(() => {
      if (isOpen) {
         Promise.resolve().then(() => setActive(true));
         document.body.style.overflow = 'hidden';
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

   // Do not render the modal if it is neither open nor animating.
   if (!isOpen && !active) return null;

   return (
      /**
       * UI Layer: Modal Overlay
       * 
       * - Backdrop: Dimmed, blurred background that closes the modal on click.
       * - Modal Card: Contains header, body, and footer sections.
       * - Animations: Smooth transitions for open/close states.
       */
      <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
         
         {/* Backdrop Layer */}
         <div 
            className="absolute inset-0 bg-[#000000]/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
         ></div>

         {/* Modal Card */}
         <div 
            className={`
               relative w-full max-w-md bg-[#121212] border border-[#333] rounded-2xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]
               transition-all duration-300 transform
               ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
            `}
         >
            {/* Header Section: Title and Close Button */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#222] bg-[#161616]">
               <div className="flex items-center gap-2 text-gray-400">
                   <FaInfoCircle size={12} />
                   <span className="text-[10px] font-bold tracking-widest uppercase">Station Info</span>
               </div>
               <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#222] text-gray-400 hover:bg-white hover:text-black transition-all duration-300"
               >
                  <FaTimes size={12} />
               </button>
            </div>

            {/* Body Section: Station Details, Stats, and Links */}
            <div className="p-6 space-y-6">
                
                {/* Station Logo and Description */}
                <div className="flex items-start gap-5">
                     <div className="relative w-20 h-20 shrink-0 bg-[#0a0a0a] rounded-xl border border-[#333] flex items-center justify-center overflow-hidden p-2">
                         <Image 
                              src="/intro-avatar/arjenmarka.png" 
                              alt="Logo" 
                              width={64} 
                              height={64} 
                              className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                         />
                     </div>
                     <div className="space-y-1 pt-1">
                         <h3 className="text-xl font-bold text-white tracking-tight">
                              Merky Radio
                         </h3>
                         <p className="text-sm text-gray-500 leading-relaxed font-medium">
                              High-fidelity synthetic atmosphere designed for deep work & coding sessions.
                         </p>
                     </div>
                </div>

                {/* Technical Statistics Grid */}
                <div className="grid grid-cols-2 gap-3">
                     <StatBox 
                         icon={<FaWifi size={12} />} 
                         label="Bitrate" 
                         value="320 KBPS" 
                     />
                     <StatBox 
                         icon={<FaMusic size={12} />} 
                         label="Frequency" 
                         value="44.1 KHZ" 
                     />
                     <div className="col-span-2">
                         <StatBox 
                              icon={<FaBroadcastTower size={12} />} 
                              label="Signal Type" 
                              value="LOSSLESS DIGITAL STREAM" 
                         />
                     </div>
                </div>

                {/* External Links (e.g., Discord) */}
                <div className="space-y-3 pt-2">
                     <a href="https://discord.gg/Vsmd5rSAJC" className="flex items-center justify-between p-3.5 rounded-xl bg-[#181818] border border-[#222] hover:bg-white hover:text-black hover:border-white transition-all duration-300 group">
                         <div className="flex items-center gap-3">
                              <FaDiscord size={16} className="text-gray-400 group-hover:text-black transition-colors" />
                              <span className="text-xs font-bold uppercase tracking-wide text-gray-300 group-hover:text-black">Join Discord</span>
                         </div>
                         <span className="text-[10px] text-gray-600 group-hover:text-black font-mono">-&gt;</span>
                     </a>
                </div>

            </div>

            {/* Footer Section: Version and Build Info */}
            <div className="p-4 border-t border-[#222] bg-[#161616] text-center">
                <p className="text-[9px] text-gray-600 font-mono tracking-widest uppercase">
                     Merky Radio v2.4.0 • Build 2025.12.31
                </p>
            </div>

         </div>
      </div>
   );
};

/**
 * StatBox
 * 
 * Displays a labeled statistic with an icon.
 * Used for presenting technical details in the modal.
 */
const StatBox = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="p-3 bg-[#181818] border border-[#222] rounded-lg flex items-center gap-3 group hover:border-[#444] transition-colors">
         <div className="w-8 h-8 rounded-lg bg-[#222] flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
             {icon}
         </div>
         <div>
             <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">{label}</div>
             <div className="text-xs text-white font-mono">{value}</div>
         </div>
    </div>
);

export default InfoModal;