import React, { useState } from 'react';
import { CommunityMember } from '../types';
import { X, Search, Sparkles, ChevronRight, Plus, LayoutGrid, List } from 'lucide-react';

interface MemberDirectoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  members: CommunityMember[];
  onSelectMember: (member: CommunityMember) => void;
  onOpenAddModal?: () => void;
}

export const MemberDirectoryDrawer: React.FC<MemberDirectoryDrawerProps> = ({
  isOpen,
  onClose,
  members,
  onSelectMember,
  onOpenAddModal,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (!isOpen) return null;

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    member: CommunityMember
  ) => {
    const target = e.currentTarget;
    const filename = member.avatar.split('/').pop() || '';
    if (filename && !target.src.includes(`/seismicart/${filename}`)) {
      target.src = `/seismicart/${filename}`;
    }
  };

  const allTags = Array.from(new Set(members.flatMap((m) => m.tags)));

  const filteredMembers = members.filter((m) => {
    const q = filterQuery.toLowerCase();
    const matchesQuery =
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.handle.toLowerCase().includes(q) ||
      m.bio.toLowerCase().includes(q) ||
      m.tags.some((t) => t.toLowerCase().includes(q));

    const matchesTag = selectedTag ? m.tags.includes(selectedTag) : true;

    return matchesQuery && matchesTag;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg h-full bg-slate-950/85 backdrop-blur-2xl border-l border-white/20 p-5 sm:p-6 flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.6),inset_1px_0_1px_0_rgba(255,255,255,0.15)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 text-rose-200 flex items-center justify-center border border-white/20 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                Artwork Library
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/15 text-rose-200 border border-white/20">
                  {filteredMembers.length}
                </span>
              </h2>
              <p className="text-[10px] text-slate-300">Browse all images in the universe</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/10 border border-white/15 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {onOpenAddModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAddModal();
                }}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-medium transition-all cursor-pointer shadow-md border border-white/20"
                title="Add Image"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/15"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="py-3.5 space-y-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search artworks by title, number, or style..."
              className="w-full bg-white/[0.06] backdrop-blur-md border border-white/15 text-xs text-white placeholder-slate-400 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-white/35 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
            />
          </div>

          {/* Tag Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer whitespace-nowrap border ${
                selectedTag === null
                  ? 'bg-white/25 text-white border-white/40 shadow-sm'
                  : 'bg-white/5 text-slate-300 hover:text-white border-white/10'
              }`}
            >
              All Images ({members.length})
            </button>
            {allTags.slice(0, 10).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer whitespace-nowrap border ${
                  selectedTag === tag
                    ? 'bg-white/25 text-white border-white/40 shadow-sm'
                    : 'bg-white/5 text-slate-300 hover:text-white border-white/10'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery / Image List */}
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => {
                    onSelectMember(member);
                    onClose();
                  }}
                  className="group relative flex flex-col rounded-xl overflow-hidden bg-white/[0.05] hover:bg-white/[0.12] border border-white/15 hover:border-white/40 transition-all cursor-pointer shadow-sm hover:shadow-lg"
                >
                  <div className="relative aspect-square w-full bg-black/40 overflow-hidden">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      loading="lazy"
                      onError={(e) => handleImageError(e, member)}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  </div>
                  <div className="p-2">
                    <h3 className="text-xs font-semibold text-white truncate group-hover:text-rose-200 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-[10px] text-slate-300 truncate">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => {
                    onSelectMember(member);
                    onClose();
                  }}
                  className="group flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 transition-all cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    loading="lazy"
                    onError={(e) => handleImageError(e, member)}
                    className="w-11 h-11 rounded-xl object-cover border border-white/80 group-hover:border-white transition-colors"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-white truncate group-hover:text-rose-200 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-[10px] text-slate-300 truncate">{member.role}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          )}

          {filteredMembers.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              No artworks found matching "{filterQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
