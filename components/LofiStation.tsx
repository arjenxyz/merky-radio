// components/LofiStation.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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

// --- TİPLER ---
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
  // --- VERİ STATE'LERİ ---
  const [tracks, setTracks] = useState<Track[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- PLAYER STATE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDayMode, setIsDayMode] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [appSettings, setAppSettings] = useState<AppSettings>({
    hideElements: false, showTitles: true, showClock: false, shortcuts: true, hideTime: 5
  });
  
  const [showControls, setShowControls] = useState(() => !appSettings.hideElements);
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  
  // --- MODAL STATES ---
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

  const [masterVolume, setMasterVolume] = useState(0.8);
  const [musicVolume, setMusicVolume] = useState(0.5);

  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // --- GÜVENLİ VERİ ERİŞİMİ (FALLBACK) ---
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

  // --- 1. DATA FETCHING (PROXY API METHOD) ---
  useEffect(() => {
    async function initData() {
      try {
        setIsLoading(true);
        console.log("🌐 Veriler sunucu üzerinden isteniyor (/api/lofi)...");
        
        const response = await fetch('/api/lofi', {
            method: 'GET',
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'API Başarısız Yanıt Döndü');
        }

        const { tracks: trackData, scenes: sceneData } = result;

        console.log(`✅ ${trackData?.length || 0} adet şarkı yüklendi.`);
        console.log(`✅ ${sceneData?.length || 0} adet sahne yüklendi.`);

        if (trackData) setTracks(trackData);
        
        if (sceneData) {
            type SceneApiResponse = {
                id: string;
                name: string;
                bg_day: string;
                bg_night: string;
                theme_color: string;
            };
            const formattedScenes = sceneData.map((s: SceneApiResponse) => ({
                id: s.id,
                name: s.name,
                bgDay: s.bg_day,     
                bgNight: s.bg_night, 
                themeColor: s.theme_color 
            }));
            setScenes(formattedScenes);
        }

      } catch (error: unknown) {
        console.error('❌ VERİ ÇEKME HATASI (PROXY):');
        if (error instanceof Error) {
          console.error('Detay:', error.message);
        } else {
          console.error('Detay:', error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    initData();
  }, []);

  // --- DİĞER PLAYER MANTIKLARI ---
  
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

  // Ses ayarı
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = musicVolume * masterVolume;
  }, [musicVolume, masterVolume]);

  const togglePlay = useCallback(async () => {
    // State'i tersine çevirmek yeterli, useEffect aşağıda işi halledecek
    setIsPlaying(prev => !prev);
  }, []);

  // Kısayollar
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
  }, [appSettings.shortcuts, togglePlay, isSettingsOpen, isWelcomeOpen, isVolumeOpen, isInfoOpen, isDevOpen]);

  // Oto Gizleme
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

  // Track Değişimi
  const changeTrack = useCallback((direction: 'next' | 'prev') => {
    if (tracks.length === 0) return;
    let newIndex = currentTrackIndex + (direction === 'next' ? 1 : -1);
    if (newIndex >= tracks.length) newIndex = 0;
    if (newIndex < 0) newIndex = tracks.length - 1;
    setCurrentTrackIndex(newIndex);
    // Track değişince otomatik oynatmayı isteyebiliriz
    setIsPlaying(true);
  }, [currentTrackIndex, tracks.length]);

  const onTimeUpdate = useCallback(() => {
    if (audioRef.current && audioRef.current.duration) {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  }, []);

  // --- KRİTİK DÜZELTME: PLAYER MANTIĞI (İKİ AYRI EFFECT) ---

  // 1. Sadece şarkı indexi değiştiğinde kaynağı yükle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Önce durdur ve yeni kaynağı yükle
    audio.pause();
    audio.load();

    // Eğer state 'playing' ise yeni şarkıyı çalmaya başla
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Otomatik oynatma hatası (Track değişimi):", error);
        });
      }
    }
  }, [currentTrackIndex]); // Not: Buraya isPlaying eklenmemeli!

  // 2. Sadece Play/Pause butonuna basıldığında
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      if (audio.paused) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
             console.error("Oynatma hatası:", error);
             // Hata olursa (örn: kullanıcı etkileşimi yoksa) UI'ı güncelle
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

  // --- RENDER ---
  if (isLoading) {
      return (
          <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white space-y-4">
              <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
              <p className="font-mono text-sm tracking-widest animate-pulse">CONNECTING TO MERKY CLOUD...</p>
          </div>
      );
  }

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
        <Background 
            dayImage={currentScene.bgDay || ''} 
            nightImage={currentScene.bgNight || ''} 
            isDayMode={isDayMode} 
        />
      </div>

      {/* KATMAN 1: SAAT & MODALLAR */}
      {appSettings.showClock && <DigitalClock />}
      
      <SettingsModal 
        isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} 
        settings={appSettings} onUpdateSettings={setAppSettings}
      />
      
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <DevModal isOpen={isDevOpen} onClose={() => setIsDevOpen(false)} />
      <WelcomeModal isOpen={isWelcomeOpen} onClose={() => setIsWelcomeOpen(false)} />
      
      <VolumeModal 
          isOpen={isVolumeOpen} onClose={() => setIsVolumeOpen(false)}
          masterVolume={masterVolume} setMasterVolume={setMasterVolume}
          musicVolume={musicVolume} setMusicVolume={setMusicVolume}
      />

      {/* KATMAN 2: UI ARAYÜZÜ */}
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
                    isPlaying={isPlaying} progress={progress} volume={masterVolume > 0 ? musicVolume : 0} 
                    isDayMode={isDayMode} isVisible={showControls || isSceneMenuOpen || isSettingsOpen || isVolumeOpen || isInfoOpen || isDevOpen}
                    onTogglePlay={togglePlay} onChangeTrack={changeTrack} onToggleMode={() => setIsDayMode(!isDayMode)}
                    onToggleSceneMenu={() => setIsSceneMenuOpen(!isSceneMenuOpen)} onOpenSettings={() => setIsSettingsOpen(true)}
                    onOpenWelcome={() => setIsWelcomeOpen(true)} onVolumeClick={() => setIsVolumeOpen(!isVolumeOpen)}
                    onOpenInfo={() => setIsInfoOpen(true)}
                    onOpenDev={() => setIsDevOpen(true)}
                  />
              </div>
          </div>
      </div>

      {/* AUDIO PLAYER */}
      {/* Sadece URL varsa render et, yoksa hata almamak için boş string geç */}
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