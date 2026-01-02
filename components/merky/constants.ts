// components/merky/constants.ts

export interface AmbientSound {
  id: string;
  name: string;
  src: string;
  defaultValue: number;
  position: { top: string; left: string }; 
}

export interface Track { 
  title: string; 
  artist: string; 
  url: string; 
  cover: string; // Artık resim yolu (path) bekliyor
}

export const TRACKS: Track[] = [
  { 
    title: "Happy Life", 
    artist: "Created by Arjen", 
    url: "/music/song4.mp3", 
    cover: "/covers/melodydance.gif" // Buraya kendi gif dosyanın adını yaz
  },
  { 
    title: "Night Drive", 
    artist: "Created by Arjen", 
    url: "/music/song2.mp3", 
    cover: "/covers/melodydance.gif" 
  },
  { 
    title: "Chill Vibes", 
    artist: "Created by Arjen", 
    url: "/music/song3.mp3", 
    cover: "/covers/melodydance.gif" 
  },
  { 
    title: "Lofi Study", 
    artist: "Created by Arjen", 
    url: "/music/song1.mp3", 
    cover: "/covers/melodydance.gif" 
  },
];

export interface Scene { id: string; name: string; bgDay: string; bgNight: string; themeColor: string; }

export const SCENES: Scene[] = [
  {
    id: "Scene-1",
    name: "Cozy Critters",
    bgDay: "/merky/scene-1.gif",
    bgNight: "/merky/scene-1.gif",
    themeColor: "#A0A0A0",
    
  },
  
  {
    id: "Scene-2",
    name: "Cozy Critters",
    bgDay: "/merky/scene-4.gif",
    bgNight: "/merky/scene-4.gif",
    themeColor: "#A0A0A0",
    
  }
];