import * as THREE from 'three';
import { CommunityMember } from '../types';

const textureLoader = new THREE.TextureLoader();
const textureCache = new Map<string, THREE.Texture>();

export function clearTextureCache() {
  textureCache.forEach((tex) => tex.dispose());
  textureCache.clear();
}

interface ImageDimensionLike {
  width?: number;
  height?: number;
  naturalWidth?: number;
  naturalHeight?: number;
}

function getImageAspect(img: unknown): number | null {
  if (!img || typeof img !== 'object') return null;
  const imageObj = img as ImageDimensionLike;
  const w = imageObj.naturalWidth || imageObj.width;
  const h = imageObj.naturalHeight || imageObj.height;
  if (w && h && w > 0 && h > 0) {
    return w / h;
  }
  return null;
}

/**
 * Creates or retrieves a cached Three.js Texture for the artwork image.
 * Uses THREE.TextureLoader for high-performance direct WebGL texture generation.
 */
export function loadArtworkTexture(
  member: CommunityMember,
  onAspectReady?: (aspectRatio: number) => void
): THREE.Texture {
  if (textureCache.has(member.id)) {
    const cached = textureCache.get(member.id)!;
    const aspect = getImageAspect(cached.image);
    if (onAspectReady && aspect) {
      onAspectReady(aspect);
    }
    return cached;
  }

  const texture = textureLoader.load(
    member.avatar,
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.needsUpdate = true;

      const aspect = getImageAspect(tex.image);
      if (onAspectReady && aspect) {
        onAspectReady(aspect);
      }
    },
    undefined,
    () => {
      // Fallback attempt with filename if asset path didn't resolve directly
      const filename = member.avatar.split('/').pop() || '';
      if (filename) {
        const fallbackUrl = `/seismicart/${filename}`;
        textureLoader.load(fallbackUrl, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = true;
          tex.needsUpdate = true;
          const aspect = getImageAspect(tex.image);
          if (onAspectReady && aspect) {
            onAspectReady(aspect);
          }
        });
      }
    }
  );

  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(member.id, texture);
  return texture;
}

export const createCardTexture = (
  member: CommunityMember,
  onAspectReady?: (aspectRatio: number) => void
) => {
  return loadArtworkTexture(member, onAspectReady);
};

/**
 * Creates a high-performance, universally compatible Material for the 3D cards
 */
export function createCardMaterial(texture: THREE.Texture): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.96,
  });
}

// Backward compatibility alias
export const createCardShaderMaterial = (texture: THREE.Texture) => createCardMaterial(texture);

