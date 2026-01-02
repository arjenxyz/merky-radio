// components/LofiStation.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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

// Yardımcı fonksiyon: Güvenli kopyalama
const safeCopyToClipboard = async (text: string): Promise<{ success: boolean; message: string }> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return { success: true, message: '✅ Koordinat panoya kopyalandı!' };
    }
    
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      return { success: true, message: '✅ Koordinat panoya kopyalandı!' };
    } else {
      return { 
        success: false, 
        message: '📋 Kopyalama için aşağıdaki metni seçip Ctrl+C yapın:' 
      };
    }
  } catch (error) {
    console.error('Kopyalama hatası:', error);
    return { 
      success: false, 
      message: '📋 Discord ortamında otomatik kopyalama desteklenmiyor. Lütfen aşağıdaki metni seçip Ctrl+C yapın:' 
    };
  }
};

// Sürüklenebilir panel bileşeni
interface DraggablePanelProps {
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  onClose?: () => void;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const DraggablePanel: React.FC<DraggablePanelProps> = ({ 
  title, 
  children, 
  defaultPosition = { x: 50, y: 50 },
  onClose,
  className = '',
  onMouseEnter,
  onMouseLeave
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!panelRef.current) return;
    
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={panelRef}
      className={`fixed z-[100] bg-black bg-opacity-90 text-white rounded-lg border-2 border-gray-700 shadow-2xl dev-panel ${className} ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        userSelect: isDragging ? 'none' : 'auto',
        minWidth: '300px'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Başlık bar - sürüklemek için */}
      <div 
        className="flex justify-between items-center p-3 border-b border-gray-700 bg-gray-900 rounded-t-lg cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="font-bold text-sm flex items-center">
          <span className="mr-2">📌</span>
          {title}
          {isDragging && (
            <span className="ml-2 text-xs text-yellow-400 animate-pulse">
              (sürükleniyor...)
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-lg w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-800"
              title="Kapat"
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {/* İçerik */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default function LofiStation() {
  // --- PLAYER STATE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDayMode, setIsDayMode] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // SHOW CONTROLS STATE - initial değeri appSettings.hideElements'e bağlı
  const [appSettings, setAppSettings] = useState<AppSettings>({
    hideElements: false, showTitles: true, showClock: false, shortcuts: true, hideTime: 5
  });
  
  const [showControls, setShowControls] = useState(() => {
    // Eğer hideElements false ise, kontroller her zaman gözüksün
    return !appSettings.hideElements;
  });
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  // --- MODAL STATE ---
  const [isSceneMenuOpen, setIsSceneMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem('merky_visited');
      return !hasVisited;
    }
    return false;
  });
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [] = useState(false);

  // --- SES SİSTEMİ ---
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [ambientVolumes, setAmbientVolumes] = useState<{ [key: string]: number }>({});
  
  // Hangi seslerin aktif (ON) olduğunu takip eden Set
  const [activeAmbienceIds, setActiveAmbienceIds] = useState<Set<string>>(() => {
    return new Set(SCENES[0].sounds.map(s => s.id));
  });

  // --- GELİŞTİRİCİ MODU & KOORDİNAT TOPLAYICI ---
  const [isDevMode, setIsDevMode] = useState(false);
  const [isCoordinateCollector, setIsCoordinateCollector] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lastClickedPosition, setLastClickedPosition] = useState<{ 
    x: number; 
    y: number; 
    top: string; 
    left: string;
    copyText: string;
    message?: string;
  } | null>(null);
  const [coordinateHistory, setCoordinateHistory] = useState<Array<{
    id: string;
    top: string; 
    left: string;
    timestamp: number;
  }>>([]);
  const [copyStatus, setCopyStatus] = useState<{ success: boolean; message: string } | null>(null);
  
  // YENİ: Panel üzerinde olma durumu
  const [isPointerOnPanel, setIsPointerOnPanel] = useState(false);

  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];
  const currentScene = SCENES[currentSceneIndex];

  // Memoize edilmiş hotspot'lar
  const memoizedHotspots = useMemo(() => 
    currentScene.sounds.map(sound => ({
      ...sound,
      currentVolume: ambientVolumes[sound.id] ?? 0,
      isActive: activeAmbienceIds.has(sound.id)
    })), 
    [currentScene.sounds, ambientVolumes, activeAmbienceIds]
  );

  // 1. LOCAL STORAGE - Welcome modal için
  useEffect(() => {
    if (isWelcomeOpen && typeof window !== 'undefined') {
      localStorage.setItem('merky_visited', 'true');
    }
  }, [isWelcomeOpen]);

  // 2. SCALE ENGINE
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

  // 3. SAHNE DEĞİŞİMİ & SES YÖNETİMİ
  useEffect(() => {
    let isMounted = true;
    
    const updateSceneSounds = () => {
      if (!isMounted) return;
      
      const allSoundIds = new Set(currentScene.sounds.map(s => s.id));
      const newVolumes: { [key: string]: number } = {};
      currentScene.sounds.forEach(sound => {
        if (ambientVolumes[sound.id] === undefined) {
          newVolumes[sound.id] = sound.defaultValue;
        } else {
          newVolumes[sound.id] = ambientVolumes[sound.id];
        }
      });
      
      setActiveAmbienceIds(allSoundIds);
      setAmbientVolumes(prev => ({ ...prev, ...newVolumes }));
    };
    
    const timer = setTimeout(updateSceneSounds, 0);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [currentSceneIndex, currentScene.sounds, ambientVolumes]);

  // 4. MOUSE KONUMU TAKİBİ (Sadece koordinat toplayıcı modunda)
  useEffect(() => {
    if (!isCoordinateCollector) return;

    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        // Eğer mouse bir panelin üzerindeyse, mousePosition'ı güncelleme
        if (isPointerOnPanel) return;
        
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        
        const x = Math.round(((e.clientX - rect.left) / scale) / 1920 * 10000) / 100;
        const y = Math.round(((e.clientY - rect.top) / scale) / 1080 * 10000) / 100;
        
        setMousePosition({ x, y });
      });
    };

    const handleClick = async (e: MouseEvent) => {
      // Eğer tıklama bir panelin üzerinde veya içinde ise, koordinat alma işlemini yapma
      const target = e.target as Element;
      const isClickOnPanel = target.closest('.dev-panel') !== null;
      
      if (isClickOnPanel) {
        // Panel üzerindeki normal işlemler için event'i durdurma, sadece koordinat almayı atla
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      
      const topPercent = Math.round(((e.clientY - rect.top) / scale) / 1080 * 10000) / 100;
      const leftPercent = Math.round(((e.clientX - rect.left) / scale) / 1920 * 10000) / 100;
      
      const coordText = `{ top: '${topPercent}%', left: '${leftPercent}%' }`;
      
      // Kopyalama işlemini yap
      const copyResult = await safeCopyToClipboard(coordText);
      setCopyStatus(copyResult);
      
      const position = {
        x: e.clientX,
        y: e.clientY,
        top: `${topPercent}%`,
        left: `${leftPercent}%`,
        copyText: coordText,
        message: copyResult.message
      };
      
      setLastClickedPosition(position);
      
      // Yeni koordinatı geçmişe ekle (unique ID ile)
      const newCoord = {
        id: `coord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        top: `${topPercent}%`,
        left: `${leftPercent}%`,
        timestamp: Date.now()
      };
      
      setCoordinateHistory(prev => [newCoord, ...prev.slice(0, 19)]); // Max 20 kayıt
      
      // Kopyalama durumunu 3 saniye sonra temizle
      setTimeout(() => setCopyStatus(null), 3000);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isCoordinateCollector, scale, isPointerOnPanel]);

  // 5. TÜM SAHNE VERİLERİNİ KOPYALAMA FONKSİYONU
  const copyAllSceneData = useCallback(async () => {
    const allCoords = currentScene.sounds.map(sound => 
      `  { id: '${sound.id}', name: '${sound.name}', position: ${JSON.stringify(sound.position)} }`
    ).join(',\n');
    
    const sceneData = `{\n  id: '${currentScene.id}',\n  name: '${currentScene.name}',\n  sounds: [\n${allCoords}\n  ]\n}`;
    
    const result = await safeCopyToClipboard(sceneData);
    alert(result.message);
    
    if (!result.success) {
      console.log('📋 Tüm sahne verileri:');
      console.log(sceneData);
    }
  }, [currentScene]);

  // 6. KOORDİNAT GEÇMİŞİ İŞLEMLERİ
  const removeCoordinate = useCallback((id: string) => {
    setCoordinateHistory(prev => prev.filter(coord => coord.id !== id));
  }, []);

  const clearAllCoordinates = useCallback(() => {
    if (coordinateHistory.length > 0 && window.confirm('Tüm koordinat geçmişini temizlemek istediğinize emin misiniz?')) {
      setCoordinateHistory([]);
    }
  }, [coordinateHistory.length]);

  const copyCoordinate = useCallback(async (coord: { top: string; left: string }) => {
    const coordText = `{ top: '${coord.top}', left: '${coord.left}' }`;
    const result = await safeCopyToClipboard(coordText);
    setCopyStatus(result);
    setTimeout(() => setCopyStatus(null), 3000);
  }, []);


  // Hotspot Tıklama (Aç/Kapa) Mantığı
  const toggleAmbience = useCallback((id: string) => {
    if (isCoordinateCollector) return;
    
    setActiveAmbienceIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }, [isCoordinateCollector]);

  // 7. MÜZİK SES AYARI
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = musicVolume * masterVolume;
  }, [musicVolume, masterVolume]);

  // 8. PLAY/PAUSE
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

  // 9. KISAYOLLAR
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!appSettings.shortcuts) return;
      if (isSettingsOpen || isWelcomeOpen || isVolumeOpen) return;
      
      if (e.code === 'Space') { 
        e.preventDefault(); 
        togglePlay(); 
      }
      if (e.code === 'KeyM') { 
        setMasterVolume((prev) => (prev === 0 ? 0.8 : 0));
      }
      // Geliştirici modu için Ctrl+D tuşu
      if (e.code === 'KeyD' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const newDevMode = !isDevMode;
        setIsDevMode(newDevMode);
        
        if (newDevMode) {
          console.log('🎮 Geliştirici Modu AÇIK');
          console.log('📝 Mevcut sahne:', currentScene.name);
          console.log('📍 Hotspot pozisyonları:');
          currentScene.sounds.forEach((sound, idx) => {
            console.log(`  ${idx + 1}. ${sound.name}:`, sound.position);
          });
        } else {
          setIsCoordinateCollector(false);
          setLastClickedPosition(null);
          setCopyStatus(null);
          setIsPointerOnPanel(false);
        }
      }
      // Koordinat toplayıcı modu için C tuşu
      if (e.code === 'KeyC' && isDevMode && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsCoordinateCollector(prev => !prev);
        if (!isCoordinateCollector) {
          console.log('🎯 Koordinat Toplayıcı Modu AÇIK');
        } else {
          console.log('📍 Koordinat Toplayıcı Modu KAPALI');
        }
      }
      // Tüm koordinatları kopyalamak için Shift+C
      if (e.code === 'KeyC' && isDevMode && e.shiftKey) {
        e.preventDefault();
        copyAllSceneData();
      }
      // Koordinat geçmişini temizlemek için Ctrl+Shift+Delete
      if (e.code === 'Delete' && e.ctrlKey && e.shiftKey && isDevMode) {
        e.preventDefault();
        clearAllCoordinates();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appSettings.shortcuts, togglePlay, isSettingsOpen, isWelcomeOpen, isVolumeOpen, isDevMode, isCoordinateCollector, currentScene, copyAllSceneData, clearAllCoordinates]);

  // 10. OTO-GİZLEME
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      
      // Eğer hideElements aktifse ve hiçbir modal açık değilse, timeout ayarla
      if (appSettings.hideElements && !isSceneMenuOpen && !isSettingsOpen && !isWelcomeOpen && !isVolumeOpen) {
        hideTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, appSettings.hideTime * 1000);
      }
    };

    // İlk yükleme durumunu ayarla
    const initializeControls = () => {
      // Eğer hideElements kapalıysa, kontrol öğelerini her zaman göster
      if (!appSettings.hideElements) {
        setShowControls(true);
      }
      // Eğer hideElements açıksa ve hiçbir modal açık değilse, ilk timeout'u ayarla
      else if (!isSceneMenuOpen && !isSettingsOpen && !isWelcomeOpen && !isVolumeOpen) {
        // Sadece ilk yüklemede ve hideElements açıkken
        handleMouseMove();
      }
    };

    // İlk yükleme
    initializeControls();

    // Event listener'ları ekle
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [isSceneMenuOpen, isSettingsOpen, isWelcomeOpen, isVolumeOpen, appSettings.hideElements, appSettings.hideTime]);

  // 11. appSettings.hideElements DEĞİŞİMİNDE KONTROLLERİ GÜNCELLE
  useEffect(() => {
    // Eğer hideElements kapatıldıysa, kontrolleri her zaman göster
    if (!appSettings.hideElements) {
      queueMicrotask(() => setShowControls(true));
      // Timeout'u temizle
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

  // Panel mouse enter/leave event'leri için yardımcı fonksiyonlar
  const handlePanelMouseEnter = useCallback(() => {
    setIsPointerOnPanel(true);
  }, []);

  const handlePanelMouseLeave = useCallback(() => {
    setIsPointerOnPanel(false);
  }, []);

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

      {/* KOORDİNAT TOPLAYICI MODU OVERLAY */}
      {isCoordinateCollector && (
        <>
          {/* Kırmızı crosshair - sadece panel üzerinde değilken göster */}
          {!isPointerOnPanel && (
            <div 
              className="fixed z-50 pointer-events-none"
              style={{
                left: mousePosition.x + '%',
                top: mousePosition.y + '%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="relative">
                <div className="absolute h-8 w-0.5 bg-red-500 -top-4 left-1/2 transform -translate-x-1/2"></div>
                <div className="absolute h-8 w-0.5 bg-red-500 -bottom-4 left-1/2 transform -translate-x-1/2"></div>
                <div className="absolute w-8 h-0.5 bg-red-500 -left-4 top-1/2 transform -translate-y-1/2"></div>
                <div className="absolute w-8 h-0.5 bg-red-500 -right-4 top-1/2 transform -translate-y-1/2"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
          )}

          {/* KOORDİNAT PANELİ - SÜRÜKLENEBİLİR */}
          <DraggablePanel
            title="🎯 KOORDİNAT TOPLAYICI"
            defaultPosition={{ x: 50, y: 50 }}
            className="min-w-[350px] max-w-[400px]"
            onMouseEnter={handlePanelMouseEnter}
            onMouseLeave={handlePanelMouseLeave}
          >
            <div className="text-center mb-3">
              <div className="text-sm text-gray-300">İstediğiniz noktaya tıklayın</div>
              <div className="text-xs text-gray-400">Panel üzerindeyken koordinat alımı durur</div>
              {copyStatus && (
                <div className={`text-xs mt-1 ${copyStatus.success ? 'text-green-400' : 'text-yellow-400'}`}>
                  {copyStatus.message}
                </div>
              )}
              {isPointerOnPanel && (
                <div className="text-xs text-blue-400 mt-1">
                  ⚠️ Panel üzerinde - koordinat alımı devre dışı
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-900 p-2 rounded">
                <div className="text-xs text-gray-400">X (Left)</div>
                <div className="font-mono text-lg">{mousePosition.x}%</div>
              </div>
              <div className="bg-gray-900 p-2 rounded">
                <div className="text-xs text-gray-400">Y (Top)</div>
                <div className="font-mono text-lg">{mousePosition.y}%</div>
              </div>
            </div>

            {lastClickedPosition && (
              <div className="mb-4 p-3 bg-gray-900 rounded border border-gray-700">
                <div className="text-xs text-gray-400 mb-1 flex justify-between">
                  <span>Son Koordinat:</span>
                  <button
                    onClick={() => copyCoordinate({ top: lastClickedPosition.top, left: lastClickedPosition.left })}
                    className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                  >
                    Tekrar Kopyala
                  </button>
                </div>
                <div className="font-mono text-sm bg-black p-2 rounded mb-2 select-all">
                  {lastClickedPosition.copyText}
                </div>
                {lastClickedPosition.message && !copyStatus?.success && (
                  <div className="text-xs text-yellow-400 mt-1 p-2 bg-yellow-900 bg-opacity-30 rounded">
                    💡 {lastClickedPosition.message}
                  </div>
                )}
              </div>
            )}

            <div className="text-xs text-gray-400 border-t border-gray-800 pt-3">
              <div className="font-semibold text-gray-300 mb-1">Kısayollar:</div>
              <div>• Başlıktan sürükleyerek paneli hareket ettirebilirsiniz</div>
              <div>• Panel üzerindeyken koordinat alımı otomatik durur</div>
              <div>• Ctrl/Cmd+C: Bu modu kapat</div>
              <div>• Shift+C: Tüm sahne verilerini kopyala</div>
              <div>• Ctrl/Shift+Delete: Tüm geçmişi temizle</div>
            </div>
          </DraggablePanel>

          {/* KOORDİNAT GEÇMİŞİ PANELİ - SÜRÜKLENEBİLİR */}
          {coordinateHistory.length > 0 && (
            <DraggablePanel
              title={`📋 KOORDİNAT GEÇMİŞİ (${coordinateHistory.length})`}
              defaultPosition={{ x: window.innerWidth - 400, y: 50 }}
              className="min-w-[350px] max-w-[400px] max-h-[500px] overflow-hidden"
              onMouseEnter={handlePanelMouseEnter}
              onMouseLeave={handlePanelMouseLeave}
            >
              <div className="mb-3 flex justify-between items-center">
                <div className="text-xs text-gray-400">
                  Son {coordinateHistory.length} kayıt
                </div>
                <div className="flex space-x-2">
                </div>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {coordinateHistory.map((coord) => (
                  <div 
                    key={coord.id} 
                    className="text-xs font-mono p-2 bg-gray-900 rounded hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="select-all cursor-pointer flex-1" onClick={() => copyCoordinate(coord)}>
                        <div className="text-gray-400 text-[10px] mb-1">
                          {new Date(coord.timestamp).toLocaleTimeString()}
                        </div>
                        <div>
                          {`{ top: '${coord.top}', left: '${coord.left}' }`}
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyCoordinate(coord)}
                          className="text-blue-400 hover:text-blue-300 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700"
                          title="Kopyala"
                        >
                          ⎘
                        </button>
                        <button
                          onClick={() => removeCoordinate(coord.id)}
                          className="text-red-400 hover:text-red-300 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700"
                          title="Sil"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-800 text-[10px] text-gray-500">
                • Kopyalamak için koordinata tıklayın
                • Üzerine gelince sil/kopyala butonları görünür
                • Panel üzerindeyken koordinat alımı durur
              </div>
            </DraggablePanel>
          )}
        </>
      )}

      {/* GELİŞTİRİCİ MODU PANELİ - SÜRÜKLENEBİLİR */}
      {isDevMode && !isCoordinateCollector && (
        <DraggablePanel
          title="🔧 GELİŞTİRİCİ MODU"
          defaultPosition={{ x: 50, y: 50 }}
          onClose={() => setIsDevMode(false)}
          className="min-w-[350px] max-w-[400px]"
          onMouseEnter={handlePanelMouseEnter}
          onMouseLeave={handlePanelMouseLeave}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-900 p-3 rounded">
                <div className="text-xs text-gray-400">Sahne</div>
                <div className="text-yellow-300 font-semibold truncate">{currentScene.name}</div>
              </div>
              <div className="bg-gray-900 p-3 rounded">
                <div className="text-xs text-gray-400">Hotspot</div>
                <div className="text-green-300 font-semibold">{currentScene.sounds.length} adet</div>
              </div>
            </div>
            
            <div>
              <div className="text-gray-300 font-semibold mb-2 text-sm">HOTSPOT KONTROLLERİ</div>
              <div className="flex flex-col gap-2">
                <button 
                  className="w-full px-3 py-2 rounded text-sm bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                  onClick={() => setIsCoordinateCollector(true)}
                >
                  🎯 Koordinat Toplayıcı Aç (Ctrl+C)
                </button>
                <button 
                  className="w-full px-3 py-2 rounded text-sm bg-purple-600 hover:bg-purple-700 flex items-center justify-center"
                  onClick={copyAllSceneData}
                >
                  📋 Tüm Hotspotları Kopyala (Shift+C)
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 border-t border-gray-800 pt-3">
              <div className="font-semibold text-gray-300 mb-1">Kısayollar:</div>
              <div>• Başlıktan sürükleyerek paneli hareket ettirin</div>
              <div>• Panel üzerindeyken koordinat alımı durur</div>
              <div>• Ctrl/Cmd+D: Bu modu kapat</div>
              <div>• Ctrl/Cmd+C: Koordinat toplayıcı</div>
              <div>• Shift+C: Tüm hotspot&apos;ları kopyala</div>
              <div>• Space: Çal/Durdur</div>
              <div>• M: Sessiz mod</div>
            </div>
          </div>
        </DraggablePanel>
      )}

      {/* KATMAN 1: INTERACTIVE HOTSPOTS */}
      <div 
        className="absolute top-1/2 left-1/2 origin-center pointer-events-none z-20"
        style={{ width: '1920px', height: '1080px', transform: `translate(-50%, -50%) scale(${scale})` }}
      >
         <div className="relative w-full h-full pointer-events-auto">
            {memoizedHotspots.map((sound) => (
              <div
                key={sound.id}
                className={`absolute cursor-pointer transition-all duration-200 rounded-full border-2 ${sound.isActive ? 'border-green-400' : 'border-gray-600'} bg-black bg-opacity-40 hover:bg-opacity-70`}
                style={{
                  top: sound.position.top,
                  left: sound.position.left,
                  width: '40px',
                  height: '40px',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 30,
                  boxShadow: sound.isActive ? '0 0 0 4px rgba(34,197,94,0.3)' : undefined,
                  pointerEvents: isCoordinateCollector ? 'none' : 'auto'
                }}
                title={sound.name}
                onClick={() => toggleAmbience(sound.id)}
              >
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <span className={`text-lg ${sound.isActive ? 'text-green-400' : 'text-gray-300'}`}>🎵</span>
                  <span className="text-[10px] text-center">{sound.name}</span>
                </div>
              </div>
            ))}
         </div>
      </div>

      {/* KATMAN 2: GÖRÜNMEZ SES MOTORU */}
      {currentScene.sounds.map((sound) => {
          const isActive = activeAmbienceIds.has(sound.id);
          const effectiveVolume = isActive ? (ambientVolumes[sound.id] ?? 0) * masterVolume : 0;
          return (
            <AmbientPlayer
              key={sound.id}
              src={sound.src}
              volume={effectiveVolume}
            />
          )
      })}

      {/* KATMAN 3: SAAT & MODALLAR */}
      {appSettings.showClock && <DigitalClock />}
      
      <SettingsModal 
        isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} 
        settings={appSettings} onUpdateSettings={setAppSettings}
      />
      
      <InfoModal 
  isOpen={isInfoOpen}              // ✅ Doğru
  onClose={() => setIsInfoOpen(false)} 
/>
      <WelcomeModal/>
      <VolumeModal 
          isOpen={isVolumeOpen} onClose={() => setIsVolumeOpen(false)}
          masterVolume={masterVolume} setMasterVolume={setMasterVolume}
          musicVolume={musicVolume} setMusicVolume={setMusicVolume}
          currentScene={currentScene} ambientVolumes={ambientVolumes}
          onUpdateAmbientVolume={(id, val) => setAmbientVolumes(prev => ({ ...prev, [id]: val }))}
          activeAmbienceIds={activeAmbienceIds}
      />

      {/* KATMAN 4: UI ARAYÜZÜ */}
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
                    isDayMode={isDayMode} isVisible={showControls || isSceneMenuOpen || isSettingsOpen || isVolumeOpen}
                    onTogglePlay={togglePlay} onChangeTrack={changeTrack} onToggleMode={() => setIsDayMode(!isDayMode)}
                    onToggleSceneMenu={() => setIsSceneMenuOpen(!isSceneMenuOpen)} onOpenSettings={() => setIsSettingsOpen(true)}
                    onOpenWelcome={() => setIsWelcomeOpen(true)} onVolumeClick={() => setIsVolumeOpen(!isVolumeOpen)}
                    onOpenInfo={() => setIsInfoOpen(true)}
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

// Yardımcı Bileşen: Ambient Player
const AmbientPlayer = ({ src, volume }: { src: string, volume: number }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);
  return <audio ref={audioRef} src={src} autoPlay loop />;
};