import * as THREE from 'three';
import { Transform3D } from '../types';

const dummy = new THREE.Object3D();

/**
 * Fibonacci Sphere distribution for uniform spacing on a 3D sphere surface.
 * Every card faces outward from the sphere center.
 */
export function generateSphereLayout(count: number, radius?: number): Transform3D[] {
  const transforms: Transform3D[] = [];
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

  // Calculate dynamic radius if not provided: keeps sphere dense with minimal empty space
  const cardArea = 2.2 * 2.2;
  const targetRadius =
    radius ?? Math.max(4.8, Math.sqrt((count * cardArea * 0.58) / (4 * Math.PI)) * 1.25);

  for (let i = 0; i < count; i++) {
    // Golden spiral algorithm on sphere
    const y = 1 - (i / Math.max(1, count - 1)) * 2; // y from 1 to -1
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = (2 * Math.PI * i) / phi;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    const posX = x * targetRadius;
    const posY = y * targetRadius;
    const posZ = z * targetRadius;

    dummy.position.set(posX, posY, posZ);
    dummy.scale.set(1, 1, 1);
    dummy.rotation.set(0, 0, 0);

    // Face outward away from center (0, 0, 0) to follow curved sphere surface
    dummy.lookAt(posX * 2, posY * 2, posZ * 2);

    const q = dummy.quaternion;

    transforms.push({
      position: [posX, posY, posZ],
      quaternion: [q.x, q.y, q.z, q.w],
      scale: [1, 1, 1],
    });
  }

  return transforms;
}

/**
 * Vertical spiral/helix distribution.
 * Cards rotate around the vertical axis and face outwards.
 */
export function generateHelixLayout(
  count: number,
  radius: number = 8.5,
  height: number = 19,
  turns: number = 4.5
): Transform3D[] {
  const transforms: Transform3D[] = [];

  for (let i = 0; i < count; i++) {
    const progress = i / Math.max(1, count - 1);
    const angle = progress * turns * Math.PI * 2;

    const posX = Math.sin(angle) * radius;
    const posY = (0.5 - progress) * height;
    const posZ = Math.cos(angle) * radius;

    dummy.position.set(posX, posY, posZ);
    dummy.scale.set(1, 1, 1);
    dummy.rotation.set(0, 0, 0);

    // Face outwards from central vertical axis (0, posY, 0)
    dummy.lookAt(posX * 2, posY, posZ * 2);
    dummy.rotateX(-0.1);

    const q = dummy.quaternion;

    transforms.push({
      position: [posX, posY, posZ],
      quaternion: [q.x, q.y, q.z, q.w],
      scale: [1, 1, 1],
    });
  }

  return transforms;
}

/**
 * Crisp 3D Grid matrix layout.
 * Cards are positioned in a perfectly aligned 3D grid with straight rows, columns, and zero jitter.
 */
export function generateGridLayout(
  count: number,
  columns: number = 5,
  rows: number = 4,
  spacingX: number = 3.2,
  spacingY: number = 3.2,
  spacingZ: number = 4.0
): Transform3D[] {
  const transforms: Transform3D[] = [];

  const itemsPerLayer = Math.max(1, columns * rows);
  const layers = Math.ceil(count / itemsPerLayer);

  const offsetX = ((columns - 1) * spacingX) / 2;
  const offsetY = ((rows - 1) * spacingY) / 2;
  const offsetZ = ((layers - 1) * spacingZ) / 2;

  for (let i = 0; i < count; i++) {
    const layer = Math.floor(i / itemsPerLayer);
    const indexInLayer = i % itemsPerLayer;
    const col = indexInLayer % columns;
    const row = Math.floor(indexInLayer / columns);

    // Perfectly aligned grid coordinates
    const posX = col * spacingX - offsetX;
    const posY = offsetY - row * spacingY;
    const posZ = offsetZ - layer * spacingZ;

    dummy.position.set(posX, posY, posZ);
    dummy.scale.set(1, 1, 1);
    dummy.rotation.set(0, 0, 0);

    const q = dummy.quaternion;

    transforms.push({
      position: [posX, posY, posZ],
      quaternion: [q.x, q.y, q.z, q.w],
      scale: [1, 1, 1],
    });
  }

  return transforms;
}

/**
 * Compact 3D Table layout (Periodic/Matrix arrangement).
 * Cards are angled in a curved matrix with natural 3D tilts.
 */
export function generateTableLayout(
  count: number,
  columns: number = 12,
  spacingX: number = 2.7,
  spacingY: number = 2.8
): Transform3D[] {
  const transforms: Transform3D[] = [];
  const rows = Math.ceil(count / columns);

  const offsetX = ((columns - 1) * spacingX) / 2;
  const offsetY = ((rows - 1) * spacingY) / 2;

  for (let i = 0; i < count; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);

    const posX = col * spacingX - offsetX;
    const posY = offsetY - row * spacingY;

    // Cylindrical curve inward towards user
    const normalizedDistFromCenter = (col - (columns - 1) / 2) / Math.max(1, (columns - 1) / 2);
    const posZ = -Math.pow(normalizedDistFromCenter, 2) * 2.8;

    dummy.position.set(posX, posY, posZ);
    dummy.scale.set(0.95, 0.95, 0.95);

    // Subtle inward Y rotation and natural X/Z tilts
    const rotY = (col - (columns - 1) / 2) * -0.06;
    const rotX = (row - (rows - 1) / 2) * 0.03;
    const rotZ = Math.cos(i * 0.5) * 0.04;
    dummy.rotation.set(rotX, rotY, rotZ);

    const q = dummy.quaternion;

    transforms.push({
      position: [posX, posY, posZ],
      quaternion: [q.x, q.y, q.z, q.w],
      scale: [0.95, 0.95, 0.95],
    });
  }

  return transforms;
}
