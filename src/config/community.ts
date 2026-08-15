import { CommunityMember, BackgroundConfig } from '../types';

export const staticArtworkFilenames: string[] = [
  'Untitled48_20251105160053.webp',
  'Untitled109_20251229011004.webp',
  'Untitled191_20260615232713.webp',
  'Untitled122_20260215205142.webp',
  'Untitled21_20251006011450.webp',
  'Untitled29_20251023123825.webp',
  'Untitled46_20251104023903.webp',
  'Untitled129_20260128212504.webp',
  'Untitled42_20251031125232.webp',
  'Untitled26_20251020023907.webp',
  'Untitled104_20251218020523.webp',
  'Untitled119_20260114015556.webp',
];

export const rawArtworkFilenames: string[] = staticArtworkFilenames;

export const communityImageFiles: string[] = rawArtworkFilenames.map((file) => `/seismicart/${file}`);

export const imageSources: string[] = communityImageFiles;

/**
 * BACKGROUND CONFIGURATION
 */
export const defaultBackgroundConfig: BackgroundConfig = {
  type: 'image',
  color: '#08080c',
  gradient: 'radial-gradient(circle at 50% 50%, #12121e 0%, #050508 100%)',
  imageUrl: '/seismic.png',
  opacity: 1,
  blur: 6,
  reflection: true,
  reflectionIntensity: 0.85,
};

const artStyles = [
  'Digital Art & Shaders',
  '3D Seismic Composition',
  'Generative Geometry',
  'Spatial Visuals',
  'Abstract Vibration',
  'Library Showcase Collection',
  'Modern Graphic Art',
  'Seismic Visual Art',
];

const sampleTags = [
  'UntitledArt',
  'SeismicShowcase',
  '3DArtwork',
  'DigitalCanvas',
  'GenerativeArt',
  'Abstract',
  'SpatialDesign',
  'DSeismicArt',
  'VisualGallery',
  'CommunityUniverse',
];

function getMemberDetailsFromFile(filenameWithSlash: string, index: number) {
  const filename = filenameWithSlash.split('/').pop() || '';
  const base = filename.replace(/\.webp$/i, '');

  const numMatch = base.match(/^Untitled(\d+)(?:_(\d+))?(?:_(\d+)|-(\d+))?/i);
  let name = `Artwork ${index + 1}`;
  let handle = `@artwork_${index + 1}`;

  if (numMatch) {
    const mainNum = numMatch[1];
    const subNum = numMatch[2];
    const extraNum = numMatch[3] || numMatch[4];

    if (extraNum) {
      name = `Artwork #${mainNum} (${extraNum})`;
      handle = `@artwork_${mainNum}_${extraNum}`;
    } else if (subNum && subNum.length <= 2) {
      name = `Artwork #${mainNum}.${subNum}`;
      handle = `@artwork_${mainNum}_${subNum}`;
    } else {
      name = `Artwork #${mainNum}`;
      handle = `@artwork_${mainNum}`;
    }
  } else if (base.startsWith('IMG')) {
    name = 'Seismic Capture';
    handle = '@seismic_capture';
  } else if (base.startsWith('b330')) {
    name = 'Seismic Genesis';
    handle = '@seismic_genesis';
  } else {
    const clean = base.replace(/[-_]/g, ' ');
    name = clean.charAt(0).toUpperCase() + clean.slice(1);
    handle = `@${base.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  }

  return {
    name,
    handle,
    originalFilename: filename,
  };
}

export function generateCommunityMembers(
  totalCount: number = 36
): CommunityMember[] {
  const members: CommunityMember[] = [];
  const sources = communityImageFiles;

  for (let i = 0; i < totalCount; i++) {
    const avatarUrl = sources[i % sources.length];
    const rawFile = rawArtworkFilenames[i % rawArtworkFilenames.length];
    const { name, handle, originalFilename } = getMemberDetailsFromFile(
      rawFile,
      i % sources.length
    );
    const role = artStyles[i % artStyles.length];

    const tag1 = 'Artwork';
    const tag2 = 'SeismicShowcase';
    const tag3 = sampleTags[(i + 2) % sampleTags.length];

    members.push({
      id: `artwork-${i + 1}-${rawFile.replace(/[^a-zA-Z0-9]/g, '_')}`,
      name,
      handle,
      role,
      avatar: avatarUrl,
      bio: `Original saved artwork "${originalFilename}" displayed in the 3D Community Universe.`,
      tags: Array.from(new Set([tag1, tag2, tag3])),
      location: 'DSeismicArt Collection',
      status: 'active',
      joinedDate: 'Library Showcase 2026',
      socials: {
        website: 'https://dseismicart.com',
      },
    });
  }

  return members;
}
