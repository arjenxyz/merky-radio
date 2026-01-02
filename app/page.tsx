'use client';

import React, { useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import LofiStation from '@/components/LofiStation';
import WelcomeModal from '@/components/merky/modal/WelcomeModal';

/**
 * Home page component.
 * Handles initial loading, welcome modal, and main application UI.
 */
export default function Home() {
  /* ---------------------- State Management ---------------------- */
  // Controls visibility of the loading screen on initial render.
  const [isLoading, setIsLoading] = useState(true);

  // Controls visibility of the welcome modal after loading completes.
  const [showWelcome, setShowWelcome] = useState(false);

  /* ---------------------- Event Handlers ------------------------ */
  /**
   * Callback invoked when the loading screen finishes.
   * Hides the loading screen and the welcome modal.
   */
  const handleIntroFinish = () => {
    setIsLoading(false);
    setShowWelcome(false);
  };

  /* ---------------------- UI Rendering -------------------------- */
  return (
    <main className="h-screen w-screen overflow-hidden bg-black relative">
      {isLoading ? (
        /* Loading Screen Layer: Displayed while the application is initializing. */
        <LoadingScreen onFinished={handleIntroFinish} />
      ) : (
        /* Main Application Layer: Displayed after loading completes. */
        <>
          {/* Primary audio station component. */}
          <LofiStation />

          {/* Welcome modal, controlled by showWelcome state. */}
          <WelcomeModal 
            isOpen={showWelcome} 
            onClose={() => setShowWelcome(false)} 
          />
        </>
      )}
    </main>
  );
}