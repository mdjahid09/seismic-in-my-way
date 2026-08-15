import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CommunityMember, LayoutMode } from '../types';
import {
  loadArtworkTexture,
  createCardMaterial,
  clearTextureCache,
} from '../utils/textureGenerator';
import {
  generateSphereLayout,
  generateHelixLayout,
  generateGridLayout,
  generateTableLayout,
} from '../utils/layouts';
import { createSeismicUniverse } from '../utils/seismicUniverse';

interface ThreeCanvasProps {
  members: CommunityMember[];
  activeMode: LayoutMode;
  onSelectMember: (member: CommunityMember) => void;
  searchQuery?: string;
  autoRotateEnabled?: boolean;
}

interface CardNode {
  member: CommunityMember;
  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  borderMesh: THREE.LineSegments;
  aspectRatio: number;
  baseTargetPos: THREE.Vector3;
  baseTargetQuaternion: THREE.Quaternion;
  baseTargetScale: THREE.Vector3;
  currentPos: THREE.Vector3;
  currentQuaternion: THREE.Quaternion;
  currentScale: THREE.Vector3;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  members,
  activeMode,
  onSelectMember,
  searchQuery = '',
  autoRotateEnabled = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardNodesRef = useRef<CardNode[]>([]);
  const hoveredNodeRef = useRef<CardNode | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Interaction State Refs
  const isDraggingRef = useRef(false);
  const previousPointerPosRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0 });
  const lastInteractionTimeRef = useRef(Date.now());
  const pinchStartDistRef = useRef<number | null>(null);

  // Camera Orbit & Scene Rotation Parameters
  const cameraDistRef = useRef(26);
  const targetCameraDistRef = useRef(26);
  const sceneRotationRef = useRef({ x: 0, y: 0 });
  const targetSceneRotationRef = useRef({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });

  // Reusable THREE objects to eliminate GC micro-stutters
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseVectorRef = useRef(new THREE.Vector2());

  // 1. Initialize Scene, Camera, Renderer, & Cards
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = Math.max(container.clientWidth || window.innerWidth || 800, 320);
    const height = Math.max(container.clientHeight || window.innerHeight || 600, 240);

    // Scene
    const scene = new THREE.Scene();

    // Floating 3D Background Universe of Seismic Crystal Monolith Logos
    const seismicUniverse = createSeismicUniverse(40);
    scene.add(seismicUniverse.universeGroup);

    // Group for holding and rotating all cards together
    const cardsGroup = new THREE.Group();
    scene.add(cardsGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(20, 25, 30);
    scene.add(keyLight);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, cameraDistRef.current);
    cameraRef.current = camera;

    // WebGL Renderer with high performance settings
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('WebGL initialization failed:', err);
      return;
    }

    // Unit Plane Geometry (1x1) scaled per node according to native image aspect ratio
    const unitGeometry = new THREE.PlaneGeometry(1, 1);

    // Generate Card Nodes preserving natural shapes & aspect ratios
    const edgesGeometry = new THREE.EdgesGeometry(unitGeometry);

    const nodes: CardNode[] = members.map((member) => {
      const node: CardNode = {
        member,
        mesh: null!,
        material: null!,
        borderMesh: null!,
        aspectRatio: 1.0,
        baseTargetPos: new THREE.Vector3(0, 0, 0),
        baseTargetQuaternion: new THREE.Quaternion(),
        baseTargetScale: new THREE.Vector3(1, 1, 1),
        currentPos: new THREE.Vector3(0, 0, 0),
        currentQuaternion: new THREE.Quaternion(),
        currentScale: new THREE.Vector3(1, 1, 1),
      };

      const texture = loadArtworkTexture(member, (computedAspect) => {
        node.aspectRatio = computedAspect;
        if (containerRef.current && cardNodesRef.current.length > 0) {
          const curW = containerRef.current.clientWidth || window.innerWidth || 800;
          updateLayoutTargets(activeMode, cardNodesRef.current, curW);
        }
      });

      const material = createCardMaterial(texture);
      const mesh = new THREE.Mesh(unitGeometry, material);
      mesh.userData = { memberId: member.id };

      // Sleek outline border frame
      const borderMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
      });
      const borderMesh = new THREE.LineSegments(edgesGeometry, borderMaterial);
      mesh.add(borderMesh);

      cardsGroup.add(mesh);

      node.mesh = mesh;
      node.material = material;
      node.borderMesh = borderMesh;

      return node;
    });

    cardNodesRef.current = nodes;

    // Calculate initial positions based on activeMode
    updateLayoutTargets(activeMode, nodes, width);

    // Initialize current positions to target positions for clean start
    nodes.forEach((node) => {
      node.currentPos.copy(node.baseTargetPos);
      node.currentQuaternion.copy(node.baseTargetQuaternion);
      node.currentScale.copy(node.baseTargetScale);
      node.mesh.position.copy(node.currentPos);
      node.mesh.quaternion.copy(node.currentQuaternion);
      node.mesh.scale.copy(node.currentScale);
    });

    // Frame Animation Loop
    let animationFrameId: number;

    const tempWorldPos = new THREE.Vector3();
    const pushVec = new THREE.Vector3();
    const computedTargetPos = new THREE.Vector3();
    const tempScaleVec = new THREE.Vector3();

    // Track raycast throttling to maintain buttery smooth 60/120 FPS
    let lastRaycastTime = 0;
    let needsRaycast = false;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const timeSinceInteraction = now - lastInteractionTimeRef.current;

      // 1. Handle Inertia & Smooth Parallax Mouse Rotation
      if (!isDraggingRef.current) {
        // Smooth parallax target tilt based on normalized mouse position (-1 to 1)
        const parallaxTargetY = mousePosRef.current.x * 0.12;
        const parallaxTargetX = mousePosRef.current.y * 0.08;

        targetSceneRotationRef.current.y += rotationVelocityRef.current.x;
        targetSceneRotationRef.current.x += rotationVelocityRef.current.y;

        rotationVelocityRef.current.x *= 0.90;
        rotationVelocityRef.current.y *= 0.90;

        // Continuous slow, graceful auto-rotation
        if (autoRotateEnabled && timeSinceInteraction > 500) {
          targetSceneRotationRef.current.y += 0.0011;
        }

        // Smoothly lerp towards target rotation + parallax
        const targetY = targetSceneRotationRef.current.y + parallaxTargetY;
        const targetX = targetSceneRotationRef.current.x + parallaxTargetX;

        sceneRotationRef.current.y += (targetY - sceneRotationRef.current.y) * 0.12;
        sceneRotationRef.current.x += (targetX - sceneRotationRef.current.x) * 0.12;
      } else {
        sceneRotationRef.current.y += (targetSceneRotationRef.current.y - sceneRotationRef.current.y) * 0.22;
        sceneRotationRef.current.x += (targetSceneRotationRef.current.x - sceneRotationRef.current.x) * 0.22;
      }

      // Clamp X rotation to prevent flipping upside down
      sceneRotationRef.current.x = THREE.MathUtils.clamp(
        sceneRotationRef.current.x,
        -Math.PI / 2.2,
        Math.PI / 2.2
      );
      targetSceneRotationRef.current.x = THREE.MathUtils.clamp(
        targetSceneRotationRef.current.x,
        -Math.PI / 2.2,
        Math.PI / 2.2
      );

      // Apply rotation to cards group
      cardsGroup.rotation.y = sceneRotationRef.current.y;
      cardsGroup.rotation.x = sceneRotationRef.current.x;

      // Camera Smooth Zoom (Lerp distance)
      cameraDistRef.current += (targetCameraDistRef.current - cameraDistRef.current) * 0.10;
      camera.position.z = cameraDistRef.current;

      // 2. Perform Throttled Raycasting only when pointer moved and not dragging
      if (!isDraggingRef.current && (needsRaycast || now - lastRaycastTime > 60)) {
        needsRaycast = false;
        lastRaycastTime = now;

        mouseVectorRef.current.set(mousePosRef.current.x, -mousePosRef.current.y);
        raycasterRef.current.setFromCamera(mouseVectorRef.current, camera);

        const intersects = raycasterRef.current.intersectObjects(cardsGroup.children, false);
        if (intersects.length > 0) {
          const hitMesh = intersects[0].object as THREE.Mesh;
          const matchedNode = nodes.find((n) => n.mesh === hitMesh);
          if (matchedNode) {
            if (hoveredNodeRef.current !== matchedNode) {
              hoveredNodeRef.current = matchedNode;
              if (containerRef.current) containerRef.current.style.cursor = 'pointer';
            }
          }
        } else if (hoveredNodeRef.current !== null) {
          hoveredNodeRef.current = null;
          if (containerRef.current) containerRef.current.style.cursor = 'grab';
        }
      }

      const isSearching = (searchQuery || '').trim().length > 0;
      const lowerSearch = (searchQuery || '').toLowerCase().trim();

      // 3. Batch Node Transformation Updates (Zero GC Allocations)
      const len = nodes.length;
      for (let i = 0; i < len; i++) {
        const node = nodes[i];
        if (!node.member || !node.mesh || !node.material) continue;

        const isHovered = hoveredNodeRef.current === node;
        const nodeLerpSpeed = isHovered ? 0.25 : 0.12;

        let isMatched = true;
        if (isSearching) {
          const name = node.member.name || '';
          const role = node.member.role || '';
          const tags = Array.isArray(node.member.tags) ? node.member.tags : [];
          isMatched =
            name.toLowerCase().includes(lowerSearch) ||
            role.toLowerCase().includes(lowerSearch) ||
            tags.some((t) => typeof t === 'string' && t.toLowerCase().includes(lowerSearch));
        }

        // Compute target position including smooth forward push on hover
        computedTargetPos.copy(node.baseTargetPos);
        if (isHovered) {
          pushVec.set(0, 0, 1.2).applyQuaternion(node.baseTargetQuaternion);
          computedTargetPos.add(pushVec);
        }

        // Depth perspective calculation: Z position relative to camera
        node.mesh.getWorldPosition(tempWorldPos);
        const relativeZ = tempWorldPos.z;
        const depthFactor = THREE.MathUtils.clamp((relativeZ + 12) / 24, 0, 1);
        const depthScaleMultiplier = activeMode === 'sphere' ? 0.8 + depthFactor * 0.35 : 1.0;

        const targetScaleVal = isHovered ? 1.38 : isMatched ? 1.0 * depthScaleMultiplier : 0.35;
        const targetOpacityVal = isMatched
          ? isHovered
            ? 1.0
            : activeMode === 'sphere'
            ? 0.55 + depthFactor * 0.45
            : 0.98
          : 0.15;

        // Apply Smooth Position Lerp
        node.currentPos.lerp(computedTargetPos, nodeLerpSpeed);
        node.mesh.position.copy(node.currentPos);

        // Apply Quaternion Slerp for smooth 3D orientation
        node.currentQuaternion.slerp(node.baseTargetQuaternion, nodeLerpSpeed);
        node.mesh.quaternion.copy(node.currentQuaternion);

        // Apply Scale Lerp using reusable vector (Zero allocations)
        tempScaleVec.set(
          node.baseTargetScale.x * targetScaleVal,
          node.baseTargetScale.y * targetScaleVal,
          node.baseTargetScale.z * targetScaleVal
        );
        node.currentScale.lerp(tempScaleVec, nodeLerpSpeed);
        node.mesh.scale.copy(node.currentScale);

        // Opacity and hover transitions
        node.material.opacity += (targetOpacityVal - node.material.opacity) * nodeLerpSpeed;

        if (node.borderMesh && node.borderMesh.material) {
          const borderMat = node.borderMesh.material as THREE.LineBasicMaterial;
          const targetBorderOpacity = isHovered ? 0.95 : isMatched ? 0.35 : 0.08;
          borderMat.opacity += (targetBorderOpacity - borderMat.opacity) * nodeLerpSpeed;
          if (isHovered) {
            borderMat.color.setHex(0xffffff);
          } else {
            borderMat.color.setHex(0xaaaaaa);
          }
        }
      }

      // 4. Update Floating 3D Background Universe (autonomous steady drift)
      seismicUniverse.updateUniverse(now);

      try {
        renderer.render(scene, camera);
      } catch {}
    };

    animate();

    // 2. Responsive Window Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = Math.max(containerRef.current.clientWidth || window.innerWidth || 800, 320);
      const h = Math.max(containerRef.current.clientHeight || window.innerHeight || 600, 240);

      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        updateLayoutTargets(activeMode, cardNodesRef.current, w);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 3. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      seismicUniverse.dispose();
      unitGeometry.dispose();
      edgesGeometry.dispose();
      nodes.forEach((node) => {
        if (node.material) node.material.dispose();
        if (node.borderMesh && node.borderMesh.material) {
          (node.borderMesh.material as THREE.Material).dispose();
        }
      });
      clearTextureCache();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [members]);

  // Update layout targets whenever activeMode or members prop changes
  useEffect(() => {
    if (cardNodesRef.current.length > 0 && containerRef.current) {
      updateLayoutTargets(activeMode, cardNodesRef.current, containerRef.current.clientWidth);
    }
  }, [activeMode, members]);

  // Helper to recompute targets according to mode, screen width, and native image shapes
  const updateLayoutTargets = (mode: LayoutMode, nodes: CardNode[], viewportWidth: number) => {
    const isMobile = viewportWidth < 640;
    const isTablet = viewportWidth >= 640 && viewportWidth < 1024;

    const count = nodes.length;
    let transforms;

    switch (mode) {
      case 'sphere': {
        const radius = isMobile
          ? Math.max(4.2, Math.sqrt(count * 1.3) * 0.88)
          : isTablet
          ? Math.max(4.5, Math.sqrt(count * 1.45) * 0.92)
          : Math.max(5.0, Math.sqrt(count * 1.6) * 0.96);
        transforms = generateSphereLayout(count, radius);
        targetCameraDistRef.current = Math.max(14.5, radius * 2.05);
        break;
      }
      case 'helix': {
        const radius = isMobile ? 5.8 : isTablet ? 7.2 : 8.5;
        const height = isMobile ? 15 : 19;
        transforms = generateHelixLayout(count, radius, height, 4.5);
        targetCameraDistRef.current = isMobile ? 24 : 20;
        break;
      }
      case 'grid': {
        const columns = isMobile ? 3 : isTablet ? 4 : 5;
        const rows = isMobile ? 2 : isTablet ? 3 : 3;
        const spacingX = isMobile ? 2.8 : 3.4;
        const spacingY = isMobile ? 2.8 : 3.4;
        const spacingZ = isMobile ? 3.8 : 4.6;
        transforms = generateGridLayout(count, columns, rows, spacingX, spacingY, spacingZ);

        const itemsPerLayer = Math.max(1, columns * rows);
        const layers = Math.ceil(count / itemsPerLayer);
        const depthExtent = layers * spacingZ;
        targetCameraDistRef.current = Math.max(20, depthExtent * 1.1 + (isMobile ? 12 : 10));
        break;
      }
      case 'table': {
        const columns = isMobile ? 7 : isTablet ? 10 : 12;
        const spacingX = isMobile ? 2.5 : 2.75;
        const spacingY = isMobile ? 2.6 : 2.85;
        transforms = generateTableLayout(count, columns, spacingX, spacingY);
        targetCameraDistRef.current = isMobile ? 30 : 24;
        break;
      }
    }

    // Apply transforms and calculate native aspect scale per node
    transforms.forEach((t, i) => {
      const node = nodes[i];
      if (node) {
        node.baseTargetPos.set(t.position[0], t.position[1], t.position[2]);
        node.baseTargetQuaternion.set(
          t.quaternion[0],
          t.quaternion[1],
          t.quaternion[2],
          t.quaternion[3]
        );

        // Native image proportions calculation
        const aspect = node.aspectRatio || 1.0;
        const baseSize = 2.2;
        let scaleX = baseSize;
        let scaleY = baseSize;

        if (aspect >= 1) {
          scaleX = baseSize * Math.min(aspect, 1.8);
          scaleY = baseSize;
        } else {
          scaleX = baseSize * Math.max(aspect, 0.5);
          scaleY = baseSize / Math.max(aspect, 0.5);
        }

        node.baseTargetScale.set(scaleX * t.scale[0], scaleY * t.scale[1], 1);
      }
    });
  };

  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    isDraggingRef.current = true;
    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
    lastInteractionTimeRef.current = performance.now();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mousePosRef.current = { x: normX, y: normY };

    // A. Handle Drag Rotation
    if (isDraggingRef.current) {
      lastInteractionTimeRef.current = performance.now();
      const deltaX = e.clientX - previousPointerPosRef.current.x;
      const deltaY = e.clientY - previousPointerPosRef.current.y;

      const sensitivity = 0.0045;
      rotationVelocityRef.current = {
        x: deltaX * sensitivity,
        y: deltaY * sensitivity,
      };

      targetSceneRotationRef.current.y += deltaX * sensitivity;
      targetSceneRotationRef.current.x += deltaY * sensitivity;

      previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    isDraggingRef.current = false;
    lastInteractionTimeRef.current = performance.now();
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    handlePointerUp(e);
    mousePosRef.current = { x: 0, y: 0 };
    previousPointerPosRef.current = { x: 0, y: 0 };
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    lastInteractionTimeRef.current = performance.now();

    const zoomSpeed = 0.03;
    const newDist = targetCameraDistRef.current + e.deltaY * zoomSpeed;

    const minDistance = 10;
    const maxDistance = 65;

    targetCameraDistRef.current = Math.max(minDistance, Math.min(maxDistance, newDist));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastInteractionTimeRef.current = performance.now();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

      if (pinchStartDistRef.current !== null) {
        const delta = pinchStartDistRef.current - dist;
        const zoomSpeed = 0.08;
        const newDist = targetCameraDistRef.current + delta * zoomSpeed;
        targetCameraDistRef.current = Math.max(10, Math.min(65, newDist));
      }
      pinchStartDistRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    pinchStartDistRef.current = null;
    isDraggingRef.current = false;
  };

  const handleClick = () => {
    if (hoveredNodeRef.current) {
      onSelectMember(hoveredNodeRef.current.member);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none touch-none overflow-hidden cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    />
  );
};
