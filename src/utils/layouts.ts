import * as THREE from 'three';
import { Transform3D } from '../types';

const dummy = new THREE.Object3D();

/**
 * Uniform Fibonacci Sphere distribution.
 * Every card is placed with uniform spacing and faces outward.
 */
export function generateSphereLayout(count: number, radius: number = 4.8): Transform3D[] {
  const transforms: Transform3D[] = [];
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

  for (let i = 0; i < count; i++) {
    // Distribute evenly along latitude
    const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = (2 * Math.PI * i) / phi;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    const posX = x * radius;
    const posY = y * radius;
    const posZ = z * radius;

    dummy.position.set(posX, posY, posZ);
    dummy.scale.set(1, 1, 1);
    dummy.rotation.set(0, 0, 0);

    // Look outward from center (0, 0, 0)
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
 * Smooth Helical Ribbon distribution.
 * Beautifully spaced vertical cylinder spiral with controlled turns.
 */
export function generateHelixLayout(
  count: number,
  radius: number = 6.2,
  height: number = 7.5,
  turns: number = 1.35
): Transform3D[] {
  const transforms: Transform3D[] = [];

  for (let i = 0; i < count; i++) {
    const progress = count === 1 ? 0.5 : i / (count - 1);
    const angle = progress * turns * Math.PI * 2 - (turns * Math.PI) / 2;

    const posX = Math.sin(angle) * radius;
    const posY = (0.5 - progress) * height;
    const posZ = Math.cos(angle) * radius;

    dummy.position.set(posX, posY, posZ);
    dummy.scale.set(1, 1, 1);
    dummy.rotation.set(0, 0, 0);

    // Face outwards perpendicular to helix curve
    dummy.lookAt(posX * 2, posY, posZ * 2);

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
 * Clean Single-Layer 2D/3D Grid Layout.
 * Arranged neatly into rows and columns with no overlapping layers.
 */
export function generateGridLayout(
  count: number,
  columns: number = 4,
  spacingX: number = 2.9,
  spacingY: number = 3.1
): Transform3D[] {
  const transforms: Transform3D[] = [];
  const rows = Math.ceil(count / columns);

  const totalW = (columns - 1) * spacingX;
  const totalH = (rows - 1) * spacingY;

  for (let i = 0; i < count; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);

    const posX = col * spacingX - totalW / 2;
    const posY = totalH / 2 - row * spacingY;
    const posZ = 0;

    dummy.position.set(posX, posY, posZ);
    dummy.scale.set(1, 1, 1);
    dummy.rotation.set(0, 0, 0); // Flat facing camera

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
 * Curved Theater/Amphitheater Table Layout.
 * Cards are laid out in rows with a gentle cylindrical curve facing the user.
 */
export function generateTableLayout(
  count: number,
  columns: number = 8,
  spacingX: number = 2.8,
  spacingY: number = 3.0,
  curveRadius: number = 18
): Transform3D[] {
  const transforms: Transform3D[] = [];
  const rows = Math.ceil(count / columns);

  const totalH = (rows - 1) * spacingY;
  const angleStep = Math.min(0.22, 1.4 / Math.max(columns - 1, 1));

  for (let i = 0; i < count; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);

    // Angle along horizontal cylindrical arc
    const normalizedCol = col - (columns - 1) / 2;
    const angle = normalizedCol * angleStep;

    const posX = Math.sin(angle) * curveRadius;
    const posZ = (Math.cos(angle) - 1) * curveRadius;
    const posY = totalH / 2 - row * spacingY;

    dummy.position.set(posX, posY, posZ);
    dummy.scale.set(1, 1, 1);
    dummy.rotation.set(0, 0, 0);

    // Look at arc center to face viewer naturally
    dummy.lookAt(posX * 1.5, posY, posZ * 1.5 - curveRadius * 0.5);

    const q = dummy.quaternion;

    transforms.push({
      position: [posX, posY, posZ],
      quaternion: [q.x, q.y, q.z, q.w],
      scale: [1, 1, 1],
    });
  }

  return transforms;
}
