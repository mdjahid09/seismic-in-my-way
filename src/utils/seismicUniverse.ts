import * as THREE from 'three';

export interface FloatingLogo {
  group: THREE.Group;
  basePosition: THREE.Vector3;
  currentPosition: THREE.Vector3;
  velocity: THREE.Vector3;
  rotationSpeed: THREE.Vector3;
  wobbleSpeed: number;
  wobbleRadius: number;
  wobblePhase: number;
  scale: number;
  baseOpacity: number;
  materials: THREE.Material[];
}

/**
 * Creates an exact high-resolution canvas texture of the Seismic crystal logo
 * with crisp faceted white lines and warm mauve crystalline facet fills.
 */
export function createSeismicLogoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, 512, 512);

  // Scaled coordinate helper based on 512x512
  // Points matching the authentic Seismic crystal monolith logo
  const pApexTop = { x: 256, y: 64 };
  const pTopRight = { x: 356, y: 110 };
  const pRightEdge = { x: 388, y: 300 };
  const pBottomRight = { x: 326, y: 450 };
  const pBottomLeft = { x: 220, y: 446 };
  const pLeftFar = { x: 122, y: 300 };
  const pTopLeftRidge = { x: 245, y: 76 };
  const pInnerCenter = { x: 345, y: 250 };
  const pInnerTop = { x: 256, y: 130 };

  // Facet Colors (Mauve / dusty charcoal purple matching Seismic logo)
  const colMain = 'rgb(92, 72, 82)';
  const colTopRight = 'rgb(112, 88, 100)';
  const colRight = 'rgb(80, 62, 70)';
  const colTopLeft = 'rgb(72, 56, 64)';
  const colBottom = 'rgb(62, 48, 54)';

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // 1. Facet: Top Right
  ctx.fillStyle = colTopRight;
  ctx.beginPath();
  ctx.moveTo(pTopLeftRidge.x, pTopLeftRidge.y);
  ctx.lineTo(pTopRight.x, pTopRight.y);
  ctx.lineTo(pInnerCenter.x, pInnerCenter.y);
  ctx.lineTo(pInnerTop.x, pInnerTop.y);
  ctx.closePath();
  ctx.fill();

  // 2. Facet: Right Slanted Ridge
  ctx.fillStyle = colRight;
  ctx.beginPath();
  ctx.moveTo(pTopRight.x, pTopRight.y);
  ctx.lineTo(pRightEdge.x, pRightEdge.y);
  ctx.lineTo(pInnerCenter.x, pInnerCenter.y);
  ctx.closePath();
  ctx.fill();

  // 3. Facet: Main Large Rhombus Face
  ctx.fillStyle = colMain;
  ctx.beginPath();
  ctx.moveTo(pInnerTop.x, pInnerTop.y);
  ctx.lineTo(pInnerCenter.x, pInnerCenter.y);
  ctx.lineTo(pBottomLeft.x, pBottomLeft.y);
  ctx.lineTo(pLeftFar.x, pLeftFar.y);
  ctx.closePath();
  ctx.fill();

  // 4. Facet: Left Bevel
  ctx.fillStyle = colTopLeft;
  ctx.beginPath();
  ctx.moveTo(pTopLeftRidge.x, pTopLeftRidge.y);
  ctx.lineTo(pInnerTop.x, pInnerTop.y);
  ctx.lineTo(pLeftFar.x, pLeftFar.y);
  ctx.closePath();
  ctx.fill();

  // 5. Facet: Bottom Right Base
  ctx.fillStyle = colBottom;
  ctx.beginPath();
  ctx.moveTo(pInnerCenter.x, pInnerCenter.y);
  ctx.lineTo(pRightEdge.x, pRightEdge.y);
  ctx.lineTo(pBottomRight.x, pBottomRight.y);
  ctx.lineTo(pBottomLeft.x, pBottomLeft.y);
  ctx.closePath();
  ctx.fill();

  // Draw Characteristic Crisp White Facet Lines
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 14;

  // Outer boundary outline
  ctx.beginPath();
  ctx.moveTo(pTopLeftRidge.x, pTopLeftRidge.y);
  ctx.lineTo(pTopRight.x, pTopRight.y);
  ctx.lineTo(pRightEdge.x, pRightEdge.y);
  ctx.lineTo(pBottomRight.x, pBottomRight.y);
  ctx.lineTo(pBottomLeft.x, pBottomLeft.y);
  ctx.lineTo(pLeftFar.x, pLeftFar.y);
  ctx.closePath();
  ctx.stroke();

  // Interior dividing white facet lines
  ctx.beginPath();
  ctx.moveTo(pInnerTop.x, pInnerTop.y);
  ctx.lineTo(pInnerCenter.x, pInnerCenter.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pInnerTop.x, pInnerTop.y);
  ctx.lineTo(pLeftFar.x, pLeftFar.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pInnerCenter.x, pInnerCenter.y);
  ctx.lineTo(pBottomLeft.x, pBottomLeft.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pInnerCenter.x, pInnerCenter.y);
  ctx.lineTo(pTopRight.x, pTopRight.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pInnerCenter.x, pInnerCenter.y);
  ctx.lineTo(pRightEdge.x, pRightEdge.y);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  return texture;
}

/**
 * Generates an authentic 3D faceted crystal geometry matching the Seismic monolith logo.
 */
export function create3DSeismicGeometry(): THREE.BufferGeometry {
  // 3D coordinates representing the faceted monolith in space
  const vertices = new Float32Array([
    // Front facets (triangles)
    // 1. Top Right Face
    -0.08, 1.45, 0.08,   0.45, 1.35, 0.02,   0.40, 0.15, 0.35,
    -0.08, 1.45, 0.08,   0.40, 0.15, 0.35,  -0.05, 0.95, 0.38,

    // 2. Right Ridge Face
    0.45, 1.35, 0.02,   0.68, -0.35, -0.05,  0.40, 0.15, 0.35,

    // 3. Main Center Rhombus
    -0.05, 0.95, 0.38,   0.40, 0.15, 0.35,  -0.35, -1.35, 0.12,
    -0.05, 0.95, 0.38,  -0.35, -1.35, 0.12, -0.92, -0.22, 0.08,

    // 4. Left Bevel Face
    -0.08, 1.45, 0.08,  -0.05, 0.95, 0.38,  -0.92, -0.22, 0.08,

    // 5. Bottom Right Face
    0.40, 0.15, 0.35,   0.68, -0.35, -0.05,  0.38, -1.40, -0.08,
    0.40, 0.15, 0.35,   0.38, -1.40, -0.08, -0.35, -1.35, 0.12,

    // Back Facets (mirrored with negative Z for complete 3D volume)
    -0.08, 1.45, -0.08,  0.40, 0.15, -0.35,  0.45, 1.35, -0.02,
    -0.08, 1.45, -0.08, -0.05, 0.95, -0.38,  0.40, 0.15, -0.35,

    0.45, 1.35, -0.02,   0.40, 0.15, -0.35,  0.68, -0.35, -0.05,

    -0.05, 0.95, -0.38, -0.35, -1.35, -0.12, 0.40, 0.15, -0.35,
    -0.05, 0.95, -0.38, -0.92, -0.22, -0.08, -0.35, -1.35, -0.12,

    -0.08, 1.45, -0.08, -0.92, -0.22, -0.08, -0.05, 0.95, -0.38,

    0.40, 0.15, -0.35,   0.38, -1.40, -0.08, 0.68, -0.35, -0.05,
    0.40, 0.15, -0.35,  -0.35, -1.35, -0.12, 0.38, -1.40, -0.08,
  ]);

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geom.computeVertexNormals();

  return geom;
}

/**
 * Builds the Floating 3D Background Universe of Seismic Logos
 */
export function createSeismicUniverse(count = 36): {
  universeGroup: THREE.Group;
  floatingLogos: FloatingLogo[];
  updateUniverse: (time: number) => void;
  dispose: () => void;
} {
  const universeGroup = new THREE.Group();
  const floatingLogos: FloatingLogo[] = [];

  const logoTexture = createSeismicLogoTexture();
  const crystal3DGeometry = create3DSeismicGeometry();
  const edgesGeometry = new THREE.EdgesGeometry(crystal3DGeometry, 20);
  const cardPlaneGeometry = new THREE.PlaneGeometry(2.4, 2.4);

  // Common materials with beautiful low-opacity glass/crystal appearance
  for (let i = 0; i < count; i++) {
    const itemGroup = new THREE.Group();
    const materials: THREE.Material[] = [];

    // Distribute in a deep 3D celestial sphere / cloud
    const radius = 60 + Math.random() * 180;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta) * 0.75;
    const z = -40 - Math.random() * 220 + (Math.cos(theta) * 40);

    const basePosition = new THREE.Vector3(x, y, z);
    itemGroup.position.copy(basePosition);

    // Random scaling from subtle background shards (1.8x) to majestic drifting monoliths (6.5x)
    const scaleFactor = 1.6 + Math.random() * 3.8;
    itemGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Soft opacity tuned to gracefully blend into the warm dark backdrop (0.12 to 0.32)
    const baseOpacity = 0.12 + Math.random() * 0.22;

    // A. 3D Faceted Crystal Mesh
    const facetMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x5a4450),
      roughness: 0.35,
      metalness: 0.25,
      transparent: true,
      opacity: baseOpacity * 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    materials.push(facetMaterial);

    const crystalMesh = new THREE.Mesh(crystal3DGeometry, facetMaterial);
    itemGroup.add(crystalMesh);

    // B. Luminous White Facet Edge Wireframe
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(0xffffff),
      transparent: true,
      opacity: baseOpacity * 1.3,
      depthWrite: false,
    });
    materials.push(edgeMaterial);

    const edgeLines = new THREE.LineSegments(edgesGeometry, edgeMaterial);
    itemGroup.add(edgeLines);

    // C. Crisp Central Seismic Logo Decal Plane
    const decalMaterial = new THREE.MeshBasicMaterial({
      map: logoTexture,
      transparent: true,
      opacity: baseOpacity * 1.1,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    materials.push(decalMaterial);

    const decalMesh = new THREE.Mesh(cardPlaneGeometry, decalMaterial);
    decalMesh.position.z = 0.05;
    itemGroup.add(decalMesh);

    // Randomize initial rotation and continuous drift velocity
    itemGroup.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );

    const rotationSpeed = new THREE.Vector3(
      (Math.random() - 0.5) * 0.003,
      (Math.random() - 0.5) * 0.004 + 0.001,
      (Math.random() - 0.5) * 0.002
    );

    const velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.015,
      (Math.random() - 0.5) * 0.012,
      (Math.random() - 0.5) * 0.010
    );

    const floatingItem: FloatingLogo = {
      group: itemGroup,
      basePosition,
      currentPosition: basePosition.clone(),
      velocity,
      rotationSpeed,
      wobbleSpeed: 0.0008 + Math.random() * 0.0012,
      wobbleRadius: 3 + Math.random() * 8,
      wobblePhase: Math.random() * Math.PI * 2,
      scale: scaleFactor,
      baseOpacity,
      materials,
    };

    floatingLogos.push(floatingItem);
    universeGroup.add(itemGroup);
  }

  // Animation Update loop - entirely autonomous cosmic drift (independent of mouse hover)
  const updateUniverse = (time: number) => {
    const len = floatingLogos.length;
    for (let i = 0; i < len; i++) {
      const item = floatingLogos[i];
      const g = item.group;

      // 1. Slow, constant, independent cosmic rotation
      g.rotation.x += item.rotationSpeed.x;
      g.rotation.y += item.rotationSpeed.y;
      g.rotation.z += item.rotationSpeed.z;

      // 2. Gentle independent orbital floating drift
      const wobble = Math.sin(time * item.wobbleSpeed + item.wobblePhase) * item.wobbleRadius;
      const wobbleCos = Math.cos(time * item.wobbleSpeed * 0.75 + item.wobblePhase) * (item.wobbleRadius * 0.6);

      g.position.x = item.basePosition.x + wobble;
      g.position.y = item.basePosition.y + wobbleCos;
      g.position.z = item.basePosition.z + Math.sin(time * 0.0005 + item.wobblePhase) * 4;

      // Slowly wrap around universe boundaries so they continuously drift through space
      item.basePosition.x += item.velocity.x;
      item.basePosition.y += item.velocity.y;
      item.basePosition.z += item.velocity.z;

      if (item.basePosition.x > 190) item.basePosition.x = -190;
      if (item.basePosition.x < -190) item.basePosition.x = 190;
      if (item.basePosition.y > 140) item.basePosition.y = -140;
      if (item.basePosition.y < -140) item.basePosition.y = 140;
      if (item.basePosition.z > -20) item.basePosition.z = -240;
      if (item.basePosition.z < -260) item.basePosition.z = -30;
    }
  };

  const dispose = () => {
    logoTexture.dispose();
    crystal3DGeometry.dispose();
    edgesGeometry.dispose();
    cardPlaneGeometry.dispose();
    floatingLogos.forEach((item) => {
      item.materials.forEach((m) => m.dispose());
    });
  };

  return {
    universeGroup,
    floatingLogos,
    updateUniverse,
    dispose,
  };
}
