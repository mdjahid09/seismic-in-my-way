import React from 'react';
import { LayoutMode } from '../types';

interface ControlDockProps {
  activeMode: LayoutMode;
  onModeChange: (mode: LayoutMode) => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  activeMode,
  onModeChange,
}) => {
  const modes: { id: LayoutMode; label: string }[] = [
    { id: 'helix', label: 'Helix' },
    { id: 'grid', label: 'Grid' },
    { id: 'table', label: 'Table' },
    { id: 'sphere', label: 'Sphere' },
  ];

  return (
    <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center p-1.5 bg-black/40 backdrop-blur-2xl border border-white/15 rounded-2xl sm:rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] select-none">
      <div className="flex items-center gap-1 sm:gap-1.5">
        {modes.map((mode) => {
          const isActive = activeMode === mode.id;

          return (
            <button
              key={mode.id}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onModeChange(mode.id);
              }}
              className={`relative px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'text-white bg-white/20 backdrop-blur-md border border-white/35 shadow-[0_2px_12px_rgba(255,255,255,0.12),inset_0_1px_1px_rgba(255,255,255,0.25)]'
                  : 'text-slate-300/80 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
              title={`Switch to ${mode.label} 3D View`}
            >
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

