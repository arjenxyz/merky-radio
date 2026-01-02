'use client';

import React, { useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import LofiStation from '@/components/LofiStation';
import WelcomeModal from '@/components/merky/WelcomeModal';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      
      {isLoading ? (
        // 1. Durum: Yükleme Ekranı (Animasyon bitince onFinished çalışır)
        <LoadingScreen onFinished={() => setIsLoading(false)} />
      ) : (
        // 2. Durum: Yükleme bittiği an Lofi İstasyonu gelir
        // Navbar YOK, tamamen odaklanılmış deneyim.
        <LofiStation />
       
      )}
      {/* WelcomeModal'ı buraya ekle. 
           Kendi içinde 'setTimeout' var, bu yüzden intro bittikten 
           sonra (yaklaşık 3.5sn sonra) otomatik açılacak. 
           Ve sadece İLK girişte açılacak. */}
       <WelcomeModal />

    </main>
  );
}