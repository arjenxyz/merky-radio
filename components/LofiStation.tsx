// components/LofiStation.tsx
'use client';

// Core Imports
import React, { useState, useRef, useEffect, useCallback } from 'react';

// UI Component Imports
import Background from './merky/background/Background';
import CenterOverlay from './merky/etc/CenterOverlay';
import ControlBar from './merky/etc/ControlBar';
import DigitalClock from './merky/etc/DigitalClock';
import SceneMenu from './merky/menu/SceneMenu';

// Modal Imports
import SettingsModal, { AppSettings } from './merky/modal/SettingsModal';
import WelcomeModal from './merky/modal/WelcomeModal';
import VolumeModal from './merky/modal/VolumeModal';
import InfoModal from './merky/modal/InfoModal';
import DevModal from './merky/modal/DevModal';

// Type Definitions
interface Track { 
  id?: number;
  title: string; 
  artist: string; 
  url: string; 
  cover: string; 
}

interface Scene { 
  id: string; 
  name: string; 
  bgDay: string; 
  bgNight: string; 
  themeColor: string; 
}

export default function LofiStation() {
  // ---------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------

  // Data States
  const [tracks, setTracks] = useState<Track[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Player Status States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDayMode, setIsDayMode] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // App Configuration
  const [appSettings, setAppSettings] = useState<AppSettings>({
    hideElements: true, 
    showTitles: true, 
    showClock: true, 
    shortcuts: true, 
    hideTime: 5
  });
  const [showControls, setShowControls] = useState(() => !appSettings.hideElements);
  const [scale, setScale] = useState(1);

  // Indices
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  // Modal States
  const [isSceneMenuOpen, setIsSceneMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [isDevOpen, setIsDevOpen] = useState(false);
  
  // Welcome Logic
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('merky_visited');
    }
    return false;
  });

  // Audio Volume
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [musicVolume, setMusicVolume] = useState(0.5);

  // ---------------------------------------------------------
  // REFS & SAFE ACCESS
  // ---------------------------------------------------------

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = tracks.length > 0 ? tracks[currentTrackIndex] : { 
      title: 'Loading System...', 
      artist: 'Merky OS', 
      url: '', 
      cover: '/intro-avatar/arjenmarka.png' 
  };

  const currentScene = scenes.length > 0 ? scenes[currentSceneIndex] : { 
      id: '0', 
      name: 'Initializing', 
      bgDay: '', 
      bgNight: '', 
      themeColor: '#000' 
  };

  // ---------------------------------------------------------
  // INITIALIZATION & DATA FETCHING
  // ---------------------------------------------------------

  useEffect(() => {
    let isMounted = true; 

    async function initData() {
      try {
        setIsLoading(true);
        // Fetch data from internal API proxy (Supabase)
        const response = await fetch('/api/lofi', {
            method: 'GET',
            cache: 'no-store'
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const result = await response.json();

        if (!result.success) throw new Error(result.error || 'API Failed');

        if (isMounted) {
            if (result.tracks) setTracks(result.tracks);
            if (result.scenes) {
                const formattedScenes = result.scenes.map((s: {
                    id: string;
                    name: string;
                    bg_day: string;
                    bg_night: string;
                    theme_color: string;
                }) => ({
                    id: s.id,
                    name: s.name,
                    bgDay: s.bg_day,     
                    bgNight: s.bg_night, 
                    themeColor: s.theme_color 
                }));
                setScenes(formattedScenes);
            }
        }

      } catch (error) {
        console.error('Data Fetch Error:', error);
      } finally {
        // --- YAPAY GECİKME (ARTIFICIAL DELAY) ---
        // Veri gelse bile 2.5 saniye bekle (Senin istediğin özellik)
        if (isMounted) {
            setTimeout(() => {
               setIsLoading(false);
            }, 2500); 
        }
      }
    }

    initData();
    return () => { isMounted = false; };
  }, []);

  // ---------------------------------------------------------
  // SIDE EFFECTS (LOGIC)
  // ---------------------------------------------------------

  useEffect(() => {
    if (isWelcomeOpen && typeof window !== 'undefined') {
      localStorage.setItem('merky_visited', 'true');
    }
  }, [isWelcomeOpen]);

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

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = musicVolume * masterVolume;
  }, [musicVolume, masterVolume]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!appSettings.shortcuts) return;
      if (isSettingsOpen || isWelcomeOpen || isVolumeOpen || isInfoOpen || isDevOpen) return;
      
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
  }, [appSettings.shortcuts, isSettingsOpen, isWelcomeOpen, isVolumeOpen, isInfoOpen, isDevOpen]);

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      if (appSettings.hideElements && !isSceneMenuOpen && !isSettingsOpen && !isWelcomeOpen && !isVolumeOpen && !isInfoOpen && !isDevOpen) {
        hideTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, appSettings.hideTime * 1000);
      }
    };

    if (!appSettings.hideElements) setShowControls(true);
    else if (!isSceneMenuOpen && !isSettingsOpen && !isWelcomeOpen && !isVolumeOpen && !isInfoOpen && !isDevOpen) handleMouseMove();

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isSceneMenuOpen, isSettingsOpen, isWelcomeOpen, isVolumeOpen, isInfoOpen, isDevOpen, appSettings.hideElements, appSettings.hideTime]);

  // ---------------------------------------------------------
  // AUDIO ENGINE LOGIC
  // ---------------------------------------------------------

  const togglePlay = useCallback(async () => {
    setIsPlaying(prev => !prev);
  }, []);

  const changeTrack = useCallback((direction: 'next' | 'prev') => {
    if (tracks.length === 0) return;
    let newIndex = currentTrackIndex + (direction === 'next' ? 1 : -1);
    
    if (newIndex >= tracks.length) newIndex = 0;
    if (newIndex < 0) newIndex = tracks.length - 1;
    
    setCurrentTrackIndex(newIndex);
    setIsPlaying(true);
  }, [currentTrackIndex, tracks.length]);

  const onTimeUpdate = useCallback(() => {
    if (audioRef.current && audioRef.current.duration) {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.load();

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Auto-play prevented by browser policy:", error);
        });
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      if (audio.paused) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
             console.error("Playback error:", error);
             setIsPlaying(false);
          });
        }
      }
    } else {
      if (!audio.paused) {
        audio.pause();
      }
    }
  }, [isPlaying]);

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  // --- 1. LOADING SCREEN (Original Simple Design) ---
  if (isLoading) {
      return (
          <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white space-y-4 z-[9999] select-none">
              {/* Sade Turuncu Spinner */}
              <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
              
              {/* Sade Yanıp Sönen Metin */}
              <p className="font-mono text-sm tracking-widest animate-pulse">
                CONNECTING TO MERKY CLOUD...
              </p>
          </div>
      );
  }

  // --- 2. MAIN APP INTERFACE ---
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none font-sans text-white bg-black" 
      style={{ backgroundColor: '#000000' }}
    >
      
      {/* BACKGROUND */}
      <div className="absolute top-1/2 left-1/2 origin-center pointer-events-none"
        style={{ width: '1920px', height: '1080px', transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        <Background 
            dayImage={currentScene.bgDay || ''} 
            nightImage={currentScene.bgNight || ''} 
            isDayMode={isDayMode} 
        />
      </div>

      {/* OVERLAYS & MODALS */}
      {appSettings.showClock && <DigitalClock />}
      
      <SettingsModal 
        isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} 
        settings={appSettings} onUpdateSettings={setAppSettings}
      />
      
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <DevModal isOpen={isDevOpen} onClose={() => setIsDevOpen(false)} />
      
      {isWelcomeOpen && (
        <WelcomeModal isOpen={isWelcomeOpen} onClose={() => setIsWelcomeOpen(false)} />
      )}
      
      <VolumeModal 
          isOpen={isVolumeOpen} onClose={() => setIsVolumeOpen(false)}
          masterVolume={masterVolume} setMasterVolume={setMasterVolume}
          musicVolume={musicVolume} setMusicVolume={setMusicVolume}
      />

      {/* CONTROLS & INTERACTIVE UI */}
      <div className={`absolute inset-0 z-50 transition-opacity duration-700 ${showControls ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
          
          <div 
             className={`absolute inset-0 ${isSceneMenuOpen || isVolumeOpen || isDevOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
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
                    scenes={scenes}
                    currentSceneIndex={currentSceneIndex} 
                    isOpen={isSceneMenuOpen}
                    onSelectScene={(index) => setCurrentSceneIndex(index)} 
                    onClose={() => setIsSceneMenuOpen(false)}
                  />
              </div>

              <div className="absolute bottom-0 left-0 w-full pointer-events-auto">
                  <ControlBar 
                    currentTrack={currentTrack}
                    themeColor={currentScene.themeColor}
                    isPlaying={isPlaying} 
                    progress={progress} 
                    volume={masterVolume > 0 ? musicVolume : 0} 
                    isDayMode={isDayMode} 
                    isVisible={showControls || isSceneMenuOpen || isSettingsOpen || isVolumeOpen || isInfoOpen || isDevOpen}
                    onTogglePlay={togglePlay} 
                    onChangeTrack={changeTrack} 
                    onToggleMode={() => setIsDayMode(!isDayMode)}
                    onToggleSceneMenu={() => setIsSceneMenuOpen(!isSceneMenuOpen)} 
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    onOpenWelcome={() => setIsWelcomeOpen(true)} 
                    onVolumeClick={() => setIsVolumeOpen(!isVolumeOpen)}
                    onOpenInfo={() => setIsInfoOpen(true)}
                    onOpenDev={() => setIsDevOpen(true)}
                  />
              </div>
          </div>
      </div>

      {/* HIDDEN AUDIO ELEMENT */}
      <audio 
        ref={audioRef}
        src={currentTrack?.url || ''}
        crossOrigin="anonymous" 
        onTimeUpdate={onTimeUpdate}
        onEnded={() => changeTrack('next')}
      />
    </div>
  );
}