// components/LofiStation.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TRACKS, SCENES } from './merky/constants';
import Background from './merky/Background';
import CenterOverlay from './merky/CenterOverlay';
import ControlBar from './merky/ControlBar';
import SceneMenu from './merky/SceneMenu';
import SettingsModal, { AppSettings } from './merky/SettingsModal';
import WelcomeModal from './merky/WelcomeModal';
import DigitalClock from './merky/DigitalClock';
import VolumeModal from './merky/VolumeModal';
import InfoModal from './merky/InfoModal';
import DevModal from './merky/DevModal';

export default function LofiStation() {
  // --- PLAYER STATE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDayMode, setIsDayMode] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // SHOW CONTROLS STATE
  const [appSettings, setAppSettings] = useState<AppSettings>({
    hideElements: false, showTitles: true, showClock: false, shortcuts: true, hideTime: 5
  });
  
  const [showControls, setShowControls] = useState(() => !appSettings.hideElements);
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  
  // --- MODAL STATE ---
  const [isSceneMenuOpen, setIsSceneMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [isDevOpen, setIsDevOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem('merky_visited');
      return !hasVisited;
    }
    return false;
  });

  // --- SES SİSTEMİ (Sadece Master ve Müzik) ---
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [musicVolume, setMusicVolume] = useState(0.5);

  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];
  const currentScene = SCENES[currentSceneIndex];

  // 1. LOCAL STORAGE - Welcome modal için
  useEffect(() => {
    if (isWelcomeOpen && typeof window !== 'undefined') {
      localStorage.setItem('merky_visited', 'true');
    }
  }, [isWelcomeOpen]);

  // 2. SCALE ENGINE (Ekran boyutuna göre arkaplanı ayarlar)
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const targetRatio = 1920 / 1080;
      const newScale = (width / height > targetRatio) ? width / 1920 : height / 1080;
      setScale(newScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. MÜZİK SES AYARI
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = musicVolume * masterVolume;
  }, [musicVolume, masterVolume]);

  // 4. PLAY/PAUSE
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Playback error:", error);
      setIsPlaying(false);
    }
  }, []);

  // 5. KISAYOLLAR (Sadece Play/Pause ve Mute kaldı)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!appSettings.shortcuts) return;
      if (isSettingsOpen || isWelcomeOpen || isVolumeOpen || isInfoOpen) return;
      
      if (e.code === 'Space') { 
        e.preventDefault(); 
        togglePlay(); 
      }
      if (e.code === 'KeyM') { 
        setMasterVolume((prev) => (prev === 0 ? 0.8 : 0));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appSettings.shortcuts, togglePlay, isSettingsOpen, isWelcomeOpen, isVolumeOpen, isInfoOpen]);

  // 6. OTO-GİZLEME (Mouse durunca arayüzü gizle)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      
      if (appSettings.hideElements && !isSceneMenuOpen && !isSettingsOpen && !isWelcomeOpen && !isVolumeOpen && !isInfoOpen) {
        hideTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, appSettings.hideTime * 1000);
      }
    };

    const initializeControls = () => {
      if (!appSettings.hideElements) {
        setShowControls(true);
      } else if (!isSceneMenuOpen && !isSettingsOpen && !isWelcomeOpen && !isVolumeOpen && !isInfoOpen) {
        handleMouseMove();
      }
    };

    initializeControls();
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [isSceneMenuOpen, isSettingsOpen, isWelcomeOpen, isVolumeOpen, isInfoOpen, appSettings.hideElements, appSettings.hideTime]);

  // appSettings.hideElements DEĞİŞİMİNDE KONTROLLERİ GÜNCELLE
  useEffect(() => {
    if (!appSettings.hideElements) {
      queueMicrotask(() => setShowControls(true));
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    }
  }, [appSettings.hideElements]);

  // Müzik Döngüleri
  const changeTrack = useCallback((direction: 'next' | 'prev') => {
    let newIndex = currentTrackIndex + (direction === 'next' ? 1 : -1);
    if (newIndex >= TRACKS.length) newIndex = 0;
    if (newIndex < 0) newIndex = TRACKS.length - 1;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(true);
  }, [currentTrackIndex]);

  const onTimeUpdate = useCallback(() => {
    if (audioRef.current && audioRef.current.duration) {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (isPlaying) audioRef.current.play().catch(e => console.log(e));
    }
  }, [currentTrackIndex, isPlaying]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none font-sans text-white bg-black" 
      style={{ backgroundColor: '#000000' }}
    >
      
      {/* KATMAN 0: ARKA PLAN */}
      <div className="absolute top-1/2 left-1/2 origin-center pointer-events-none"
        style={{ width: '1920px', height: '1080px', transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        <Background dayImage={currentScene.bgDay} nightImage={currentScene.bgNight} isDayMode={isDayMode} />
      </div>

      {/* KATMAN 1: SAAT & MODALLAR */}
      {appSettings.showClock && <DigitalClock />}
      
      <SettingsModal 
        isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} 
        settings={appSettings} onUpdateSettings={setAppSettings}
      />
      
      <InfoModal 
        isOpen={isInfoOpen} 
        onClose={() => setIsInfoOpen(false)} 
      />
      
      <WelcomeModal 
  isOpen={isWelcomeOpen} 
  onClose={() => setIsWelcomeOpen(false)} 
/>
      
      <VolumeModal 
          isOpen={isVolumeOpen} onClose={() => setIsVolumeOpen(false)}
          masterVolume={masterVolume} setMasterVolume={setMasterVolume}
          musicVolume={musicVolume} setMusicVolume={setMusicVolume}
      />
      <DevModal isOpen={isDevOpen} onClose={() => setIsDevOpen(false)} />


      {/* KATMAN 2: UI ARAYÜZÜ */}
      <div className={`absolute inset-0 z-50 transition-opacity duration-700 ${showControls ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
          
          <div 
             className={`absolute inset-0 ${isSceneMenuOpen || isVolumeOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
             onClick={(e) => {
                if (isSceneMenuOpen && e.target === e.currentTarget) setIsSceneMenuOpen(false);
                if (isVolumeOpen && !((e.target as Element).closest('.volume-modal'))) setIsVolumeOpen(false);
             }}
          >
             {appSettings.showTitles && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="pointer-events-auto">
                      <CenterOverlay isPlaying={isPlaying} isVisible={true} />
                  </div>
               </div>
             )}

             <div className="pointer-events-auto">
                 <SceneMenu 
                   scenes={SCENES} currentSceneIndex={currentSceneIndex} isOpen={isSceneMenuOpen}
                   onSelectScene={(index) => setCurrentSceneIndex(index)} onClose={() => setIsSceneMenuOpen(false)}
                 />
             </div>

             <div className="absolute bottom-0 left-0 w-full pointer-events-auto">
                 <ControlBar 
                   currentTrack={currentTrack}
                   themeColor={currentScene.themeColor}
                   isPlaying={isPlaying} progress={progress} volume={masterVolume > 0 ? musicVolume : 0} 
                   isDayMode={isDayMode} isVisible={showControls || isSceneMenuOpen || isSettingsOpen || isVolumeOpen || isInfoOpen}
                   onTogglePlay={togglePlay} onChangeTrack={changeTrack} onToggleMode={() => setIsDayMode(!isDayMode)}
                   onToggleSceneMenu={() => setIsSceneMenuOpen(!isSceneMenuOpen)} onOpenSettings={() => setIsSettingsOpen(true)}
                   onOpenWelcome={() => setIsWelcomeOpen(true)} onVolumeClick={() => setIsVolumeOpen(!isVolumeOpen)}
                   onOpenInfo={() => setIsInfoOpen(true)}
                   onOpenDev={() => setIsDevOpen(true)}
                 />
             </div>
          </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        crossOrigin="anonymous" 
        onTimeUpdate={onTimeUpdate}
        onEnded={() => changeTrack('next')}
      />
    </div>
  );
}