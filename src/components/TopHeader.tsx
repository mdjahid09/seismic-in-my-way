import React, { useRef } from 'react';
import { Search, Users, Sparkles, SlidersHorizontal, Plus, FolderArchive } from 'lucide-react';

interface TopHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalMembers: number;
  onOpenSettings: () => void;
  onOpenMemberDirectory: () => void;
  onOpenAddModal?: () => void;
  onUploadZip?: (file: File) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  searchQuery,
  onSearchChange,
  totalMembers,
  onOpenSettings,
  onOpenMemberDirectory,
  onOpenAddModal,
  onUploadZip,
}) => {
  const zipInputRef = useRef<HTMLInputElement>(null);

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onUploadZip) {
      onUploadZip(e.target.files[0]);
    }
  };

  return (
    <header className="fixed top-5 inset-x-0 z-30 px-4 sm:px-8 pointer-events-none flex items-center justify-between">
      {/* Hidden ZIP file input */}
      <input
        ref={zipInputRef}
        type="file"
        accept=".zip,application/zip,application/x-zip-compressed"
        onChange={handleZipChange}
        className="hidden"
      />

      {/* Title & Brand */}
      <div className="pointer-events-auto flex items-center gap-3 bg-white/[0.06] backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.15)] hover:border-white/30 hover:bg-white/[0.09] transition-all">
        <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/25 flex items-center justify-center text-white/90 shadow-[0_0_12px_rgba(255,255,255,0.15)]">
          <Sparkles className="w-4 h-4 text-rose-200" />
        </div>
        <div>
          <h1 className="text-xs sm:text-sm font-semibold tracking-wide text-white uppercase flex items-center gap-2">
            3D Community Universe
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-normal bg-white/10 text-rose-200 border border-white/20 font-mono shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
              ACTIVE NODES {totalMembers}
            </span>
          </h1>
          <p className="text-[10px] text-slate-300/80 hidden sm:block">Interactive Spatial Showcase</p>
        </div>
      </div>

      {/* Right Action Controls: Search & Controls */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-rose-200/80 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search community..."
            className="w-32 sm:w-48 bg-white/[0.06] backdrop-blur-xl border border-white/20 text-xs text-white placeholder-slate-300/60 pl-9 pr-3 py-2 rounded-2xl focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.12)]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Load ZIP Button */}
        {onUploadZip && (
          <button
            onClick={() => zipInputRef.current?.click()}
            title="Import Images from ZIP Archive"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.06] backdrop-blur-xl hover:bg-white/[0.12] text-slate-200 hover:text-white rounded-2xl text-xs font-medium transition-all cursor-pointer shadow-[0_8px_32px_0_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.15)] border border-white/20 hover:border-white/35"
          >
            <FolderArchive className="w-3.5 h-3.5 text-rose-200" />
            <span className="hidden sm:inline">Import ZIP</span>
          </button>
        )}

        {/* Add Image Button */}
        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            title="Add Images to 3D Universe"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-rose-500/70 to-indigo-600/70 hover:from-rose-500/85 hover:to-indigo-600/85 backdrop-blur-xl text-white rounded-2xl text-xs font-medium transition-all cursor-pointer shadow-[0_8px_24px_0_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.2)] border border-white/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Image</span>
          </button>
        )}

        {/* Directory Drawer Button */}
        <button
          onClick={onOpenMemberDirectory}
          title="View Member List"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.06] backdrop-blur-xl border border-white/20 hover:border-white/35 hover:bg-white/[0.12] text-slate-200 hover:text-white rounded-2xl text-xs transition-all cursor-pointer shadow-[0_8px_32px_0_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.15)]"
        >
          <Users className="w-3.5 h-3.5 text-rose-200" />
          <span className="hidden md:inline">Directory</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          title="Background & Settings"
          className="p-2.5 bg-white/[0.06] backdrop-blur-xl border border-white/20 hover:border-white/35 hover:bg-white/[0.12] text-slate-200 hover:text-white rounded-2xl transition-all cursor-pointer shadow-[0_8px_32px_0_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.15)]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
