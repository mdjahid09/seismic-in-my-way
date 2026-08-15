import React from 'react';
import { BackgroundConfig } from '../types';
import { X, Sliders, Palette, Image as ImageIcon, Sparkles, Code2, Check } from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundConfig: BackgroundConfig;
  onUpdateBackgroundConfig: (newConfig: BackgroundConfig) => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  backgroundConfig,
  onUpdateBackgroundConfig,
}) => {
  if (!isOpen) return null;

  const bgTypes: { id: BackgroundConfig['type']; label: string; desc: string }[] = [
    { id: 'particles', label: 'Cosmic Grid', desc: 'Radial gradient with subtle grid mesh' },
    { id: 'color', label: 'Solid Color', desc: 'Pure solid background color' },
    { id: 'gradient', label: 'Gradient', desc: 'Custom CSS radial/linear gradient' },
    { id: 'image', label: 'Background Image', desc: 'Custom backdrop image URL' },
  ];

  const presetColors = ['#08080c', '#0f172a', '#18181b', '#030712', '#111827', '#000000'];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-slate-950/70 backdrop-blur-2xl border-l border-white/20 p-6 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5),inset_1px_0_1px_0_rgba(255,255,255,0.15)] text-white overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 text-rose-200 flex items-center justify-center border border-white/20 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Display & Background</h2>
              <p className="text-[10px] text-slate-300">Configure backdrop and 3D visual theme</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/15"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Background Mode Selector */}
        <div className="space-y-4 mb-6">
          <label className="text-xs font-medium text-slate-200 uppercase tracking-wider block">
            Background Mode
          </label>
          <div className="grid grid-cols-1 gap-2">
            {bgTypes.map((type) => {
              const isActive = backgroundConfig.type === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() =>
                    onUpdateBackgroundConfig({
                      ...backgroundConfig,
                      type: type.id,
                    })
                  }
                  className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer backdrop-blur-md ${
                    isActive
                      ? 'bg-white/20 border-white/40 text-white shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2)]'
                      : 'bg-white/[0.05] border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white border border-white/30' : 'bg-white/10 text-slate-300'}`}>
                    <Palette className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-200'}`}>
                      {type.label}
                    </p>
                    <p className="text-[10px] text-slate-300">{type.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Controls based on chosen type */}
        {backgroundConfig.type === 'color' && (
          <div className="space-y-3 mb-6 bg-white/[0.05] backdrop-blur-md p-4 rounded-2xl border border-white/15">
            <label className="text-xs font-medium text-slate-200 block">Preset Background Colors</label>
            <div className="flex items-center gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() =>
                    onUpdateBackgroundConfig({
                      ...backgroundConfig,
                      color,
                    })
                  }
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-xl border transition-transform cursor-pointer flex items-center justify-center ${
                    backgroundConfig.color === color
                      ? 'border-white scale-110 shadow-lg'
                      : 'border-white/20'
                  }`}
                >
                  {backgroundConfig.color === color && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
            <div className="mt-2">
              <label className="text-[10px] text-slate-400 block mb-1">Custom Hex Code</label>
              <input
                type="text"
                value={backgroundConfig.color}
                onChange={(e) =>
                  onUpdateBackgroundConfig({
                    ...backgroundConfig,
                    color: e.target.value,
                  })
                }
                className="w-full bg-white/10 border border-white/20 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-white/40"
              />
            </div>
          </div>
        )}

        {backgroundConfig.type === 'image' && (
          <div className="space-y-4 mb-6 bg-white/[0.05] backdrop-blur-md p-4 rounded-2xl border border-white/15">
            <div>
              <label className="text-xs font-medium text-slate-200 block mb-1.5">Custom Image Backdrop URL</label>
              <input
                type="text"
                value={backgroundConfig.imageUrl || ''}
                onChange={(e) =>
                  onUpdateBackgroundConfig({
                    ...backgroundConfig,
                    imageUrl: e.target.value,
                  })
                }
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-white/10 border border-white/20 text-xs text-white px-3 py-2 rounded-xl placeholder-slate-400 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-200">Background Blur</label>
                <span className="text-[11px] font-mono text-rose-200 bg-white/10 px-2 py-0.5 rounded-md">
                  {backgroundConfig.blur ?? 6}px
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                step={1}
                value={backgroundConfig.blur ?? 6}
                onChange={(e) =>
                  onUpdateBackgroundConfig({
                    ...backgroundConfig,
                    blur: Number(e.target.value),
                  })
                }
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-400"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                <span>Sharp (0px)</span>
                <span>Subtle (6px)</span>
                <span>Deep (25px)</span>
              </div>
            </div>

            {/* Glass Reflection Controls */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-200">Glass Reflection</p>
                  <p className="text-[10px] text-slate-400">Prismatic specular caustic sheen</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateBackgroundConfig({
                      ...backgroundConfig,
                      reflection: !(backgroundConfig.reflection ?? true),
                    })
                  }
                  className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                    (backgroundConfig.reflection ?? true) ? 'bg-rose-500' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      (backgroundConfig.reflection ?? true) ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {(backgroundConfig.reflection ?? true) && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] text-slate-300">Reflection Intensity</label>
                    <span className="text-[10px] font-mono text-rose-200 bg-white/10 px-1.5 py-0.5 rounded">
                      {Math.round((backgroundConfig.reflectionIntensity ?? 0.85) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={backgroundConfig.reflectionIntensity ?? 0.85}
                    onChange={(e) =>
                      onUpdateBackgroundConfig({
                        ...backgroundConfig,
                        reflectionIntensity: Number(e.target.value),
                      })
                    }
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-400"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Centralized Config Code Snippet Reference */}
        <div className="mt-auto bg-white/[0.06] backdrop-blur-md border border-white/15 p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-rose-200 text-xs font-semibold">
            <Code2 className="w-4 h-4" />
            <span>Developer Note</span>
          </div>
          <p className="text-[11px] text-slate-200 leading-relaxed">
            All images and background parameters are centralized in:
          </p>
          <code className="block bg-black/30 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-rose-200 border border-white/15">
            src/config/community.ts
          </code>
          <p className="text-[10px] text-slate-300">
            Edit <span className="text-white">imageSources</span> array to swap images or replace default member profiles instantly.
          </p>
        </div>
      </div>
    </div>
  );
};
