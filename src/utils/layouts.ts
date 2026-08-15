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
  radius: number = 8.2,
  height: number = 13.0,
  turns: number = 3.2
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
 * Dimensional 3D Grid Layout.
 * Arranged in clean, aligned rows and columns with guaranteed visible gaps/spacing,
 * combined with subtle 3D depth (varied Z positions & scales) to create a sophisticated,
 * dimensional floating gallery where cards never touch or overlap.
 */
export function generateGridLayout(
  count: number,
  columns: number = 6,
  spacingX: number = 3.15,
  spacingY: number = 3.65,
  depthIntensity: number = 1.6
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

    // Staggered multi-frequency depth offset for pronounced 3D relief without misalignment
    // Alternates adjacent cells forward and backward with a smooth spatial modulation
    const checker = ((col + row) % 2 === 0 ? 1 : -1) * 0.45;
    const wave = Math.sin(col * 1.3 + row * 0.8) * 0.55;
    const zOffset = (checker + wave) * depthIntensity; // Range approx -1.6 to +1.6

    // Proportional scale variation: cards floating closer are slightly larger (0.90x to 1.10x)
    const normalizedDepth = zOffset / (depthIntensity || 1); // -1 to +1
    const scaleFactor = 1.0 + normalizedDepth * 0.10;

    // Subtle dimensional tilt angle so cards catch spatial light & perspective
    const tiltX = Math.sin(row * 1.1 + col * 0.9) * 0.045;
    const tiltY = Math.cos(col * 1.2 - row * 0.7) * 0.045;

    dummy.position.set(posX, posY, zOffset);
    dummy.scale.set(scaleFactor, scaleFactor, 1);
    dummy.rotation.set(tiltX, tiltY, 0);

    const q = dummy.quaternion;

    transforms.push({
      position: [posX, posY, zOffset],
      quaternion: [q.x, q.y, q.z, q.w],
      scale: [scaleFactor, scaleFactor, 1],
    });
  }

  return transforms;
}

/**
 * Curved Theater/Amphitheater Table Layout.
 * Cards are laid out in compact, structured rows with a gentle cylindrical curve facing the user.
 */
export function generateTableLayout(
  count: number,
  columns: number = 8,
  spacingX: number = 2.3,
  spacingY: number = 2.7,
  curveRadius: number = 16
): Transform3D[] {
  const transforms: Transform3D[] = [];
  const rows = Math.ceil(count / columns);

  const totalH = (rows - 1) * spacingY;
  const angleStep = Math.min(0.20, 1.4 / Math.max(columns - 1, 1));

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
