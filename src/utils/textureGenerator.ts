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
      if (filename && !member.avatar.includes(`/seismicart/${filename}`)) {
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

// Backward compatible alias
export const createCardTexture = (
  member: CommunityMember,
  onAspectReady?: (aspectRatio: number) => void
) => {
  return loadArtworkTexture(member, onAspectReady);
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D map;
  uniform float uRadius;
  uniform float uBorderWidth;
  uniform vec4 uBorderColor;
  uniform float uOpacity;
  uniform float uHover;

  varying vec2 vUv;

  float sdRoundRect(vec2 p, vec2 halfSize, float r) {
    vec2 d = abs(p) - halfSize + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
  }

  void main() {
    vec2 p = vUv - vec2(0.5);
    vec2 halfSize = vec2(0.5);
    float r = clamp(uRadius, 0.01, 0.35);

    float dist = sdRoundRect(p, halfSize, r);
    float edgeSmoothing = fwidth(dist);
    if (edgeSmoothing <= 0.0) edgeSmoothing = 0.005;

    // Cutout outside the rounded card
    float alphaMask = 1.0 - smoothstep(0.0, edgeSmoothing, dist);
    if (alphaMask <= 0.002) {
      discard;
    }

    // Sample the native artwork image texture (pure, authentic image colors)
    vec4 texColor = texture2D(map, vUv);

    // Clean subtle white border outline
    float borderDist = dist + uBorderWidth;
    float borderMask = smoothstep(-edgeSmoothing, 0.0, borderDist);

    // Mix artwork with crisp white border
    vec3 rgb = mix(texColor.rgb, uBorderColor.rgb, borderMask * uBorderColor.a);

    // Subtle hover luminance enhancement
    if (uHover > 0.0) {
      rgb += vec3(0.06) * uHover;
    }

    gl_FragColor = vec4(rgb, texColor.a * alphaMask * uOpacity);

    #include <colorspace_fragment>
  }
`;

/**
 * Creates a GPU-accelerated ShaderMaterial for the 3D card with rounded corners and crisp outline.
 */
export function createCardShaderMaterial(texture: THREE.Texture): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      map: { value: texture },
      uRadius: { value: 0.06 },
      uBorderWidth: { value: 0.018 },
      uBorderColor: { value: new THREE.Vector4(1.0, 1.0, 1.0, 0.95) },
      uOpacity: { value: 1.0 },
      uHover: { value: 0.0 },
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}
