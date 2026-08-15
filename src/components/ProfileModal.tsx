import React from 'react';
import { CommunityMember } from '../types';
import { X } from 'lucide-react';

interface ProfileModalProps {
  member: CommunityMember | null;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ member, onClose }) => {
  if (!member) return null;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const filename = member.avatar.split('/').pop() || '';
    if (filename && !target.src.includes(`/seismicart/${filename}`)) {
      target.src = `/seismicart/${filename}`;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-2xl animate-fade-in cursor-pointer select-none"
      onClick={onClose}
    >
      {/* Floating Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white/90 hover:text-white transition-all cursor-pointer z-10 border border-white/20 shadow-2xl shadow-black/80 hover:scale-105"
        title="Close Preview"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Clean Full Image Display */}
      <div
        className="relative max-w-full max-h-full flex items-center justify-center pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Backlight Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-indigo-500/20 rounded-3xl blur-3xl transform scale-105 pointer-events-none" />

        <img
          src={member.avatar}
          alt={member.name}
          onError={handleImageError}
          className="relative max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-2 border-white/90 transition-transform duration-300 hover:scale-[1.01]"
        />
      </div>
    </div>
  );
};
