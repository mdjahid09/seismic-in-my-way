import React, { useState, useRef } from 'react';
import { CommunityMember } from '../types';
import { X, Upload, Plus, Image as ImageIcon, Sparkles, Check, Link } from 'lucide-react';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMembers: (newMembers: CommunityMember[]) => void;
  onUploadZip?: (file: File) => void;
  currentCount: number;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMembers,
  onUploadZip,
  currentCount,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [uploadedImages, setUploadedImages] = useState<{ url: string; file?: File }[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      const zipFile = files.find((f) => f.name.endsWith('.zip') || f.type.includes('zip'));

      if (zipFile && onUploadZip) {
        onUploadZip(zipFile);
        onClose();
        return;
      }

      const newItems = files.map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setUploadedImages((prev) => [...prev, ...newItems]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files) as File[];
      const zipFile = files.find((f) => f.name.endsWith('.zip') || f.type.includes('zip'));

      if (zipFile && onUploadZip) {
        onUploadZip(zipFile);
        onClose();
        return;
      }

      const imgFiles = files.filter((f) => f.type.startsWith('image/'));
      const newItems = imgFiles.map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setUploadedImages((prev) => [...prev, ...newItems]);
    }
  };

  const handleAddUrl = () => {
    const urls = urlInput
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urls.length > 0) {
      const newItems = urls.map((url) => ({ url }));
      setUploadedImages((prev) => [...prev, ...newItems]);
      setUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadedImages.length === 0) return;

    const newMembers: CommunityMember[] = uploadedImages.map((imgItem, idx) => {
      const nodeNum = currentCount + idx + 1;
      const name = customName.trim()
        ? uploadedImages.length > 1
          ? `${customName.trim()} ${idx + 1}`
          : customName.trim()
        : `Node ${nodeNum}`;

      const role = customRole.trim() || 'Community Member';

      return {
        id: `custom-member-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
        name,
        handle: `@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        role,
        avatar: imgItem.url,
        bio: `Custom node uploaded to 3D Community Universe.`,
        tags: ['Custom', '3D Node', 'New'],
        location: 'Global',
        status: 'online',
        joinedDate: 'Joined Today',
      };
    });

    onAddMembers(newMembers);
    setUploadedImages([]);
    setCustomName('');
    setCustomRole('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-950/75 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] text-white relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/10 text-rose-200 border border-white/20 flex items-center justify-center shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Add Images to 3D Universe</h2>
              <p className="text-xs text-slate-300">Upload custom images or add image URLs into space</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/15"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source Tabs */}
        <div className="flex items-center gap-2 p-1 bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'upload' ? 'bg-white/20 text-white shadow-sm border border-white/25' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image File(s)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'url' ? 'bg-white/20 text-white shadow-sm border border-white/25' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Image URL(s)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Upload Area */}
          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-white/40 rounded-2xl p-6 text-center cursor-pointer bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.zip,application/zip,application/x-zip-compressed"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-rose-200 border border-white/15 group-hover:scale-110 flex items-center justify-center mx-auto mb-3 transition-transform shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-white">
                Click to browse or drag & drop images or ZIP archive here
              </p>
              <p className="text-[10px] text-slate-300 mt-1">PNG, JPG, WEBP, GIF or ZIP Archive (Auto-extracts images recursively)</p>
            </div>
          )}

          {/* URL Input Area */}
          {activeTab === 'url' && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-200 block">Image URL(s)</label>
              <textarea
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/photo-...\nPaste one or multiple image URLs (one per line)"
                rows={3}
                className="w-full bg-white/[0.06] border border-white/15 text-xs text-white p-3 rounded-xl focus:outline-none focus:border-white/35 placeholder-slate-400 resize-none"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                disabled={!urlInput.trim()}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-xs rounded-lg transition-colors cursor-pointer border border-white/15"
              >
                + Add URL(s) to Queue
              </button>
            </div>
          )}

          {/* Preview Queue */}
          {uploadedImages.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-200">
                <span>Selected Images ({uploadedImages.length}):</span>
                <button
                  type="button"
                  onClick={() => setUploadedImages([])}
                  className="text-[10px] text-rose-200 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {uploadedImages.map((item, index) => (
                  <div key={index} className="relative group shrink-0">
                    <img
                      src={item.url}
                      alt={`Upload ${index}`}
                      className="w-14 h-14 rounded-xl object-cover border border-white/25"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] shadow-md cursor-pointer border border-white/30"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Details */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Name / Title (Optional)</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Alex Creator"
                className="w-full bg-white/[0.06] border border-white/15 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-white/35"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Role / Tag (Optional)</label>
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="e.g. 3D Artist"
                className="w-full bg-white/[0.06] border border-white/15 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-white/35"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadedImages.length === 0}
              className="px-5 py-2.5 bg-white/20 hover:bg-white/30 disabled:opacity-40 text-white font-medium text-xs rounded-xl shadow-lg border border-white/25 transition-all flex items-center gap-2 cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-200" />
              <span>Add {uploadedImages.length || ''} Node(s) to 3D Universe</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
