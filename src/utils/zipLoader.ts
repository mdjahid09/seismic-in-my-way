import JSZip from 'jszip';
import { CommunityMember } from '../types';

export interface LoadingProgress {
  loaded: number;
  total: number;
  statusText?: string;
}

export interface ZipProcessResult {
  members: CommunityMember[];
  discoveredCount: number;
  successfulCount: number;
  failedCount: number;
}

const SUPPORTED_EXTENSIONS = /\.(jpg|jpeg|png|webp|gif)$/i;

function cleanFileName(path: string): string {
  const parts = path.split('/');
  const fileName = parts[parts.length - 1];
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
  const clean = nameWithoutExt.replace(/[-_]/g, ' ').trim();
  return clean || 'Community Member';
}

function getMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
}

/**
 * Extracts all supported images recursively from a ZIP buffer/file,
 * pre-loads them as textures/images, and returns CommunityMember nodes.
 */
export async function processZipFile(
  zipInput: ArrayBuffer | Blob | File,
  onProgress?: (progress: LoadingProgress) => void
): Promise<ZipProcessResult> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(zipInput);
  } catch (err) {
    console.error('Failed to parse ZIP archive:', err);
    throw new Error('Invalid ZIP file format');
  }

  const imageEntries: { path: string; entry: JSZip.JSZipObject }[] = [];

  zip.forEach((relativePath, zipEntry) => {
    if (zipEntry.dir) return;
    if (relativePath.includes('__MACOSX') || relativePath.split('/').pop()?.startsWith('.')) return;

    if (SUPPORTED_EXTENSIONS.test(relativePath)) {
      imageEntries.push({ path: relativePath, entry: zipEntry });
    }
  });

  const discoveredCount = imageEntries.length;
  let loadedCount = 0;
  let failedCount = 0;

  if (onProgress) {
    onProgress({ loaded: 0, total: discoveredCount, statusText: 'Extracting images from ZIP...' });
  }

  const members: CommunityMember[] = [];

  for (let i = 0; i < imageEntries.length; i++) {
    const { path: filePath, entry } = imageEntries[i];
    const rawFileName = filePath.split('/').pop() || filePath;

    try {
      const blob = await entry.async('blob');
      const mimeType = getMimeType(filePath);
      const typedBlob = new Blob([blob], { type: mimeType });
      const objectUrl = URL.createObjectURL(typedBlob);

      const img = new Image();
      img.src = objectUrl;

      await new Promise<void>((resolve) => {
        img.onload = () => {
          const title = cleanFileName(filePath);
          const member: CommunityMember = {
            id: `zip-node-${i + 1}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: title,
            handle: `@${title.toLowerCase().replace(/[^a-z0-9]/g, '')}_${i + 1}`,
            role: 'Community Member',
            avatar: objectUrl,
            preloadedImg: img,
            bio: `Uploaded from ZIP archive: ${rawFileName}`,
            tags: ['Community', 'Avatar', 'ZIP'],
            location: '3D Community Universe',
            status: 'active',
            joinedDate: 'Joined 2026',
          };

          members.push(member);
          loadedCount++;
          resolve();
        };

        img.onerror = () => {
          console.warn(`Failed to load image from ZIP: ${rawFileName}`);
          failedCount++;
          resolve();
        };
      });
    } catch (e) {
      console.warn(`Failed to extract image entry from ZIP: ${rawFileName}`, e);
      failedCount++;
    }

    if (onProgress) {
      onProgress({
        loaded: loadedCount + failedCount,
        total: discoveredCount,
        statusText: `LOADING COMMUNITY ${loadedCount + failedCount} / ${discoveredCount}`,
      });
    }
  }

  console.log(`ZIP images discovered: ${discoveredCount}`);
  console.log(`Images loaded successfully: ${loadedCount}`);
  console.log(`Images failed: ${failedCount}`);

  return {
    members,
    discoveredCount,
    successfulCount: loadedCount,
    failedCount,
  };
}

/**
 * Attempts to fetch and load default ZIP files (/avatars.zip, /community.zip, /seismicart.zip)
 */
export async function loadDefaultZip(
  zipUrl: string = '/avatars.zip',
  onProgress?: (progress: LoadingProgress) => void
): Promise<ZipProcessResult | null> {
  try {
    const res = await fetch(zipUrl);
    if (!res.ok) {
      return null;
    }
    const arrayBuffer = await res.arrayBuffer();
    return await processZipFile(arrayBuffer, onProgress);
  } catch (err) {
    console.warn(`Could not load default ZIP from ${zipUrl}:`, err);
    return null;
  }
}
