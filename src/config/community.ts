import { CommunityMember, BackgroundConfig } from '../types';

export const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/lgz6kjbg/image/upload/v1786813992';

export const staticArtworkFilenames: string[] = [
  'Untitled6_1.webp',
  'Untitled8_20250926020237.webp',
  'Untitled21_20251006011450.webp',
  'Untitled26_20251020023907.webp',
  'Untitled28_20251021144526.webp',
  'Untitled29_20251023123825.webp',
  'Untitled37_20251027234935.webp',
  'Untitled42_20251031125232.webp',
  'Untitled46_20251104023903.webp',
  'Untitled48_20251105160053.webp',
  'Untitled60_20251109124344.webp',
  'Untitled61_20251109120913.webp',
  'Untitled74_20251117191746.webp',
  'Untitled75_20251117131919.webp',
  'Untitled87_20251123153308.webp',
  'Untitled92_20251125192228.webp',
  'Untitled94_20260407003755.webp',
  'Untitled95_20251130194314.webp',
  'Untitled97_20251204003337.webp',
  'Untitled99_20251209010122.webp',
  'Untitled100_20251210215032.webp',
  'Untitled103_20251214200105.webp',
  'Untitled104_20251218020523.webp',
  'Untitled106_20251219000317.webp',
  'Untitled109_20251229011004.webp',
  'Untitled111_20251231232331.webp',
  'Untitled113_20260102011913.webp',
  'Untitled114_20260107004905.webp',
  'Untitled119_20260114015556.webp',
  'Untitled122_20260215205142.webp',
  'Untitled124_20260119000531.webp',
  'Untitled127_20260121201340.webp',
  'Untitled129_20260128212504.webp',
  'Untitled129_20260421002804.webp',
  'Untitled134_20260209234630.webp',
  'Untitled139_20260222235531.webp',
  'Untitled141_20260225160800.webp',
  'Untitled143_20260228045450.webp',
  'Untitled145_20260304211823.webp',
  'Untitled146_20260311193901.webp',
  'Untitled147_20260318182949.webp',
  'Untitled156_20260405000445.webp',
  'Untitled157_20260330231052_1.webp',
  'Untitled160_20260408194250.webp',
  'Untitled168_20260413233744.webp',
  'Untitled175.webp',
  'Untitled177_20260512145722.webp',
  'Untitled178_20260519230228.webp',
  'Untitled184_20260604223833.webp',
  'Untitled187_20260610233229.webp',
  'Untitled191_20260615232713.webp',
  'Untitled196_20260622212813.webp',
  'Untitled197_20260629225206.webp',
  'Untitled200_20260709141512.webp',
  'Untitled201_20260716200509.webp',
  'Untitled203_20260721142053.webp',
  'Untitled205_20260805205144.webp',
  'IMG_20260423_195150.webp',
  'b33014a1-b531-4ca0-865c-6138bd17fe12.webp',
];

export const rawArtworkFilenames: string[] = staticArtworkFilenames;

// Cloudinary-hosted avatar image URLs
export const communityImageFiles: string[] = rawArtworkFilenames.map(
  (file) => `${CLOUDINARY_BASE_URL}/${file}`
);

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
  totalCount: number = staticArtworkFilenames.length
): CommunityMember[] {
  const members: CommunityMember[] = [];
  const sources = communityImageFiles;
  const count = Math.min(totalCount, sources.length);

  for (let i = 0; i < count; i++) {
    const avatarUrl = sources[i];
    const rawFile = rawArtworkFilenames[i];
    const { name, handle, originalFilename } = getMemberDetailsFromFile(
      rawFile,
      i
    );
    const role = artStyles[i % artStyles.length];

    const tag1 = 'Artwork';
    const tag2 = 'SeismicArt';
    const tag3 = sampleTags[i % sampleTags.length];

    members.push({
      id: `artwork-${i + 1}-${rawFile.replace(/[^a-zA-Z0-9]/g, '_')}`,
      name,
      handle,
      role,
      avatar: avatarUrl,
      bio: `Original artwork "${originalFilename}" in the Seismic 3D Gallery.`,
      tags: Array.from(new Set([tag1, tag2, tag3])),
      location: 'Seismic Visual Collection',
      status: 'active',
      joinedDate: 'Exhibition 2026',
      socials: {
        website: 'https://dseismicart.com',
      },
    });
  }

  return members;
}
