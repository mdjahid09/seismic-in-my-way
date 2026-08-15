import React, { useState } from 'react';
import { LayoutMode, CommunityMember, BackgroundConfig } from './types';
import { generateCommunityMembers, defaultBackgroundConfig } from './config/community';
import { ThreeCanvas } from './components/ThreeCanvas';
import { BackgroundView } from './components/BackgroundView';
import { ControlDock } from './components/ControlDock';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  const [activeMode, setActiveMode] = useState<LayoutMode>('helix');
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  const [backgroundConfig] = useState<BackgroundConfig>(defaultBackgroundConfig);

  // Dynamic state for community members / 3D image nodes initialized immediately
  const [members] = useState<CommunityMember[]>(() => generateCommunityMembers());

  return (
    <div className="relative w-screen h-screen overflow-hidden text-slate-100 font-sans select-none">
      {/* 1. Standalone Background Layer with Image, Subtle Blur, and Glass Reflection */}
      <BackgroundView config={backgroundConfig} />

      {/* 2. Top Centered Title */}
      <div className="fixed top-8 sm:top-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex justify-center text-center">
        <h1 className="text-xs sm:text-sm font-semibold tracking-[0.35em] sm:tracking-[0.45em] text-white/95 uppercase select-none drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
          Seismic in my way
        </h1>
      </div>

      {/* 3. Main 3D WebGL Canvas */}
      <main className="w-full h-full">
        <ThreeCanvas
          members={members}
          activeMode={activeMode}
          onSelectMember={(m) => setSelectedMember(m)}
          autoRotateEnabled={true}
        />
      </main>

      {/* 4. Bottom Mode Switcher Dock */}
      <ControlDock
        activeMode={activeMode}
        onModeChange={(mode) => setActiveMode(mode)}
      />

      {/* 5. Profile Details Modal (Tapped Artwork Preview) */}
      <ProfileModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}
