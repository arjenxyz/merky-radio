// components/merky/SettingsModal.tsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';

export interface AppSettings {
  hideElements: boolean;
  showClock: boolean;
  shortcuts: boolean;
  showTitles: boolean; // YENİ: Başlıkları gizleme ayarı
  hideTime: number;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  if (!isOpen) return null;

  const update = (key: keyof AppSettings, value: boolean | number) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4">
      <div className="bg-[#1e1e24] w-full max-w-[400px] rounded-2xl border border-white/10 shadow-2xl p-6 relative">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white tracking-wide">Settings</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="space-y-6">
          
          {/* 1. Hide Elements (Arayüzü Gizle) */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-white font-medium text-sm">Hide Interface</h3>
                <p className="text-xs text-white/40 mt-1 leading-relaxed max-w-[220px]">
                  Auto-hide controls when inactive.
                </p>
              </div>
              <ToggleSwitch checked={settings.hideElements} onChange={() => update('hideElements', !settings.hideElements)} />
            </div>

            <div className={`mt-3 bg-white/5 rounded-lg p-3 flex items-center justify-between transition-all ${!settings.hideElements ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <span className="text-white/60 text-sm">Hide After</span>
              <div className="flex items-center gap-2">
                 <input 
                   type="number" 
                   value={settings.hideTime} 
                   onChange={(e) => update('hideTime', parseInt(e.target.value))}
                   className="w-12 bg-transparent text-right text-orange-400 font-bold focus:outline-none"
                   min={1}
                 />
                 <span className="text-orange-400 font-bold text-sm">sec</span>
              </div>
            </div>
          </div>

          {/* 2. Show Titles (YENİ: MERKY Yazısını Gizle) */}
          <div className="flex justify-between items-center">
             <span className="text-white font-medium text-sm">Show Main Titles</span>
             <ToggleSwitch checked={settings.showTitles} onChange={() => update('showTitles', !settings.showTitles)} />
          </div>

          {/* 3. Show Clock */}
          <div className="flex justify-between items-center">
             <span className="text-white font-medium text-sm">Show Clock</span>
             <ToggleSwitch checked={settings.showClock} onChange={() => update('showClock', !settings.showClock)} />
          </div>

          {/* 4. Keyboard Shortcuts */}
          <div>
            <div className="flex justify-between items-start">
               <div>
                 <span className="text-white font-medium text-sm">Keyboard Shortcuts</span>
                 <p className="text-xs text-white/40 mt-1 leading-relaxed">
                   [SPACE] to Play/Pause, [M] to Mute.
                 </p>
               </div>
               <ToggleSwitch checked={settings.shortcuts} onChange={() => update('shortcuts', !settings.shortcuts)} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <div onClick={onChange} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${checked ? 'bg-orange-500' : 'bg-gray-600'}`}>
    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
  </div>
);

export default SettingsModal;