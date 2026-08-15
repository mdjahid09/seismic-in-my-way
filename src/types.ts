export type LayoutMode = 'sphere' | 'helix' | 'grid' | 'table';

export interface Transform3D {
  position: [number, number, number];
  quaternion: [number, number, number, number]; // Quaternion [x, y, z, w]
  scale: [number, number, number];
}

export interface CommunityMember {
  id: string;
  name: string;
  handle: string;
  role: string;
  avatar: string;
  preloadedImg?: HTMLImageElement;
  bio: string;
  tags: string[];
  location?: string;
  status?: 'online' | 'active' | 'contributor';
  joinedDate?: string;
  socials?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface BackgroundConfig {
  type: 'color' | 'gradient' | 'particles' | 'image';
  color: string;
  gradient?: string;
  imageUrl?: string;
  opacity?: number;
  blur?: number;
  reflection?: boolean;
  reflectionIntensity?: number;
}
