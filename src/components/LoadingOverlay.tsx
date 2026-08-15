import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
  loaded: number;
  total: number;
  statusText?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  loaded,
  total,
  statusText = 'LOADING COMMUNITY',
}) => {
  if (!isLoading) return null;

  const percent = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl text-white transition-opacity duration-300">
      <div className="flex flex-col items-center max-w-sm px-6 text-center">
        {/* Animated Icon Circle */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-2xl shadow-indigo-500/20">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Minimal Text Loading Indicator */}
        <h2 className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-2">
          {statusText.startsWith('LOADING') ? statusText : 'LOADING COMMUNITY'}
        </h2>

        {/* Dynamic Count: 127 / 500 */}
        <div className="text-3xl font-extrabold tracking-tight text-white font-mono my-1">
          {loaded} / {total > 0 ? total : '...'}
        </div>

        {/* Smooth Progress Bar */}
        <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden my-4 border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-200 ease-out rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-400 font-medium">
          Extracting & preparing 3D textures from ZIP...
        </p>
      </div>
    </div>
  );
};
