'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Rotate3d, 
  Sun, 
  Moon, 
  Sparkles, 
  Calendar, 
  Maximize2, 
  Layers, 
  Check, 
  ChevronRight,
  Shield,
  Clock
} from 'lucide-react';

export interface StonePreset {
  id: string;
  name: string;
  category: 'Quartz' | 'Marble' | 'Quartzite' | 'Porcelain';
  colorGroup: string;
  pricePerSqFt: number;
  baseColor: string;
  veinColor: string;
  roughness: number;
  metalness: number;
  bumpScale: number;
  tileStyle?: string;
  description: string;
}

export const STONE_PRESETS: StonePreset[] = [
  {
    id: 'calacatta-gold',
    name: 'Calacatta Gold Supreme Quartz',
    category: 'Quartz',
    colorGroup: 'White & Gold',
    pricePerSqFt: 68,
    baseColor: '#f7f6f2',
    veinColor: '#bfa373',
    roughness: 0.12,
    metalness: 0.05,
    bumpScale: 0.03,
    tileStyle: 'Artisan Zellige White',
    description: 'Luminous milky white field with warm ribbons of honey gold, caramel, and cool slate.',
  },
  {
    id: 'nero-marquina',
    name: 'Nero Marquina Grand Noir',
    category: 'Marble',
    colorGroup: 'Obsidian Black',
    pricePerSqFt: 79,
    baseColor: '#111215',
    veinColor: '#f0f3f6',
    roughness: 0.08,
    metalness: 0.08,
    bumpScale: 0.04,
    tileStyle: 'Volcanic Basalt Chevron',
    description: 'Deep velvet obsidian black with striking electric-white lightning streaks.',
  },
  {
    id: 'verde-alpi',
    name: 'Verde Alpi Emerald Marble',
    category: 'Marble',
    colorGroup: 'Forest Emerald',
    pricePerSqFt: 94,
    baseColor: '#123023',
    veinColor: '#8ee4af',
    roughness: 0.14,
    metalness: 0.04,
    bumpScale: 0.03,
    tileStyle: 'Fluted Botanical Green',
    description: 'Deep serpentinite alpine emerald with intricate jade and white quartz crystalline web veining.',
  },
  {
    id: 'taj-mahal',
    name: 'Taj Mahal Brazilian Quartzite',
    category: 'Quartzite',
    colorGroup: 'Warm Cream & Pearl',
    pricePerSqFt: 88,
    baseColor: '#ded3c3',
    veinColor: '#9e8b74',
    roughness: 0.18,
    metalness: 0.06,
    bumpScale: 0.05,
    tileStyle: 'Honed Travertine Stack',
    description: '100% natural Brazilian rock with the warm fluidity of marble and hardness exceeding granite.',
  },
  {
    id: 'laurent-porcelain',
    name: 'Laurent Sintered Ultra-Porcelain',
    category: 'Porcelain',
    colorGroup: 'Dark Umber & Gold',
    pricePerSqFt: 92,
    baseColor: '#201f22',
    veinColor: '#d4af37',
    roughness: 0.22,
    metalness: 0.12,
    bumpScale: 0.04,
    tileStyle: 'Large Format Matte Gray',
    description: 'Sintered particle technology. Completely heat-proof, UV-impervious, and scratch-proof.',
  },
];

interface ThreeStoneStageProps {
  selectedPresetId?: string;
  onBookCallWithSpec: (materialName: string, price: number) => void;
  onOpenQuoteModal: (materialName: string) => void;
}

export function ThreeStoneStage({
  selectedPresetId,
  onBookCallWithSpec,
  onOpenQuoteModal,
}: ThreeStoneStageProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeStone, setActiveStone] = useState<StonePreset>(() => {
    if (selectedPresetId) {
      const match = STONE_PRESETS.find(
        (s) => s.id === selectedPresetId || s.name.toLowerCase().includes(selectedPresetId.toLowerCase())
      );
      if (match) return match;
    }
    return STONE_PRESETS[0];
  });
  const [lightingMode, setLightingMode] = useState<'daylight' | 'moody' | 'golden'>('daylight');
  const [cameraView, setCameraView] = useState<'waterfall' | 'top' | 'close'>('waterfall');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [isInteractive, setIsInteractive] = useState<boolean>(false);

  useEffect(() => {
    if (selectedPresetId) {
      const match = STONE_PRESETS.find(
        (s) => s.id === selectedPresetId || s.name.toLowerCase().includes(selectedPresetId.toLowerCase())
      );
      if (match) {
        setActiveStone(match);
      }
    }
  }, [selectedPresetId]);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const islandGroupRef = useRef<THREE.Group | null>(null);
  const stoneMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);

  // Generate procedural organic stone texture canvas
  const createStoneTexture = (baseHex: string, veinHex: string, darkVein = false) => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Base background with subtle cloud gradients
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 1024, 1024);

    // Soft marble clouding
    const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
    grad.addColorStop(0, 'rgba(255,255,255,0.08)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0.06)');
    grad.addColorStop(1, 'rgba(255,255,255,0.05)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Draw realistic fractal-like marble veining
    ctx.strokeStyle = veinHex;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const drawBranch = (startX: number, startY: number, length: number, angle: number, depth: number) => {
      if (depth <= 0) return;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      let x = startX;
      let y = startY;
      const steps = 12;
      for (let i = 0; i < steps; i++) {
        x += (Math.cos(angle) * (length / steps)) + (Math.random() - 0.5) * 12;
        y += (Math.sin(angle) * (length / steps)) + (Math.random() - 0.5) * 12;
        ctx.lineTo(x, y);
      }
      ctx.globalAlpha = Math.max(0.15, depth * 0.22);
      ctx.stroke();

      if (Math.random() > 0.4) {
        drawBranch(x, y, length * 0.7, angle + 0.4, depth - 1);
      }
      if (Math.random() > 0.4) {
        drawBranch(x, y, length * 0.65, angle - 0.45, depth - 1);
      }
    };

    // Draw primary veins
    for (let i = 0; i < 6; i++) {
      drawBranch(
        (i * 180) % 1024,
        (i * 220) % 1024,
        280,
        Math.PI * 0.22 + (Math.random() * 0.2),
        4
      );
    }

    // Micro-veins
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 14; i++) {
      drawBranch(
        Math.random() * 1024,
        Math.random() * 1024,
        140,
        Math.random() * Math.PI * 2,
        2
      );
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.5, 1.5);
    return texture;
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#0c0d10');

    // Subtle atmospheric fog for luxury depth
    scene.fog = new THREE.FogExp2('#0c0d10', 0.08);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.2, 3.2, 5.2);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent going under floor
    controls.minDistance = 3.2;
    controls.maxDistance = 9.5;
    controls.target.set(0, 0.8, 0);
    controlsRef.current = controls;

    // 5. Lights
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.85);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight = new THREE.DirectionalLight('#ffffff', 2.2);
    dirLight.position.set(5, 8, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 25;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Accent Rim / Specular Point Light
    const pointLight = new THREE.PointLight('#e8c688', 1.8, 15);
    pointLight.position.set(-3, 3.5, 2);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // 6. Build the Luxury Waterfall Kitchen Island & Backsplash Group
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);
    islandGroupRef.current = islandGroup;

    // Shared stone material
    const initialTexture = createStoneTexture(activeStone.baseColor, activeStone.veinColor);
    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: activeStone.baseColor,
      map: initialTexture || undefined,
      roughness: activeStone.roughness,
      metalness: activeStone.metalness,
      envMapIntensity: 1.2,
    });
    stoneMaterialRef.current = stoneMaterial;

    // Cabinetry / Base Wood Material (Charcoal Fluted Walnut)
    const cabinetMaterial = new THREE.MeshStandardMaterial({
      color: '#1a1b1e',
      roughness: 0.75,
      metalness: 0.1,
    });

    // Waterfall Countertop Geometry:
    // A. Main Countertop Slab (3m wide, 1.2m deep, 0.08m thick)
    const topGeometry = new THREE.BoxGeometry(3.2, 0.1, 1.4);
    const topMesh = new THREE.Mesh(topGeometry, stoneMaterial);
    topMesh.position.set(0, 1.35, 0);
    topMesh.castShadow = true;
    topMesh.receiveShadow = true;
    islandGroup.add(topMesh);

    // B. Left Waterfall Leg (slab descending to the floor with precision mitered joint)
    const legGeometry = new THREE.BoxGeometry(0.1, 1.4, 1.4);
    const legMesh = new THREE.Mesh(legGeometry, stoneMaterial);
    legMesh.position.set(-1.55, 0.65, 0);
    legMesh.castShadow = true;
    legMesh.receiveShadow = true;
    islandGroup.add(legMesh);

    // C. Island Cabinet Base (dark charcoal walnut carcass underneath)
    const baseGeometry = new THREE.BoxGeometry(2.8, 1.25, 1.2);
    const baseMesh = new THREE.Mesh(baseGeometry, cabinetMaterial);
    baseMesh.position.set(0.1, 0.625, 0);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    islandGroup.add(baseMesh);

    // D. Inset Stainless Steel Undermount Sink
    const sinkMaterial = new THREE.MeshStandardMaterial({
      color: '#cbd5e1',
      roughness: 0.15,
      metalness: 0.9,
    });
    const sinkGeometry = new THREE.BoxGeometry(0.8, 0.03, 0.5);
    const sinkMesh = new THREE.Mesh(sinkGeometry, sinkMaterial);
    sinkMesh.position.set(0.6, 1.41, 0.05);
    islandGroup.add(sinkMesh);

    // E. Luxury Matte Black Gooseneck Faucet
    const faucetMaterial = new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.25,
      metalness: 0.85,
    });
    const faucetStem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.35, 16), faucetMaterial);
    faucetStem.position.set(0.6, 1.58, -0.28);
    faucetStem.castShadow = true;
    islandGroup.add(faucetStem);

    // F. Architectural Backsplash Tile Wall Behind Island
    const tileCanvas = document.createElement('canvas');
    tileCanvas.width = 512;
    tileCanvas.height = 512;
    const tCtx = tileCanvas.getContext('2d');
    if (tCtx) {
      tCtx.fillStyle = '#1e2229';
      tCtx.fillRect(0, 0, 512, 512);
      tCtx.strokeStyle = '#2d333b';
      tCtx.lineWidth = 2;
      // Grid of 4x4 tiles
      for (let x = 0; x < 512; x += 64) {
        tCtx.beginPath();
        tCtx.moveTo(x, 0);
        tCtx.lineTo(x, 512);
        tCtx.stroke();
      }
      for (let y = 0; y < 512; y += 32) {
        tCtx.beginPath();
        tCtx.moveTo(0, y);
        tCtx.lineTo(512, y);
        tCtx.stroke();
      }
    }
    const tileTexture = new THREE.CanvasTexture(tileCanvas);
    tileTexture.repeat.set(3, 3);
    tileTexture.wrapS = THREE.RepeatWrapping;
    tileTexture.wrapT = THREE.RepeatWrapping;

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: '#e5e7eb',
      map: tileTexture,
      roughness: 0.35,
      metalness: 0.05,
    });
    const wallGeometry = new THREE.BoxGeometry(4.8, 2.8, 0.08);
    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh.position.set(0, 1.4, -1.8);
    wallMesh.receiveShadow = true;
    islandGroup.add(wallMesh);

    // G. Minimalist Architectural Floor (Polished concrete / matte micro-cement)
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: '#15161a',
      roughness: 0.6,
      metalness: 0.1,
    });
    const floorGeometry = new THREE.PlaneGeometry(16, 16);
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-rotation when user is not manually interacting
      if (islandGroupRef.current && isRotating && !isInteractive) {
        islandGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.25) * 0.15;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update stone material whenever activeStone changes
  useEffect(() => {
    if (!stoneMaterialRef.current) return;
    const mat = stoneMaterialRef.current;
    mat.color = new THREE.Color(activeStone.baseColor);
    mat.roughness = activeStone.roughness;
    mat.metalness = activeStone.metalness;

    const newTex = createStoneTexture(activeStone.baseColor, activeStone.veinColor);
    if (newTex) {
      mat.map = newTex;
      mat.needsUpdate = true;
    }
  }, [activeStone]);

  // Update Lighting Mode
  useEffect(() => {
    if (!dirLightRef.current || !ambientLightRef.current || !pointLightRef.current || !sceneRef.current) return;

    if (lightingMode === 'daylight') {
      sceneRef.current.background = new THREE.Color('#0e1014');
      dirLightRef.current.color = new THREE.Color('#ffffff');
      dirLightRef.current.intensity = 2.4;
      ambientLightRef.current.color = new THREE.Color('#ffffff');
      ambientLightRef.current.intensity = 0.9;
      pointLightRef.current.color = new THREE.Color('#a5b4fc');
      pointLightRef.current.intensity = 0.8;
    } else if (lightingMode === 'golden') {
      sceneRef.current.background = new THREE.Color('#14100c');
      dirLightRef.current.color = new THREE.Color('#ffedd5');
      dirLightRef.current.intensity = 2.6;
      ambientLightRef.current.color = new THREE.Color('#fdba74');
      ambientLightRef.current.intensity = 0.75;
      pointLightRef.current.color = new THREE.Color('#f59e0b');
      pointLightRef.current.intensity = 2.2;
    } else {
      // Moody Evening
      sceneRef.current.background = new THREE.Color('#07080a');
      dirLightRef.current.color = new THREE.Color('#93c5fd');
      dirLightRef.current.intensity = 1.2;
      ambientLightRef.current.color = new THREE.Color('#1e293b');
      ambientLightRef.current.intensity = 0.45;
      pointLightRef.current.color = new THREE.Color('#fcd34d');
      pointLightRef.current.intensity = 3.0;
    }
  }, [lightingMode]);

  // Camera presets
  const handleCameraPreset = (view: 'waterfall' | 'top' | 'close') => {
    setCameraView(view);
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    if (view === 'waterfall') {
      cam.position.set(4.2, 2.8, 4.6);
      ctrl.target.set(0, 0.8, 0);
    } else if (view === 'top') {
      cam.position.set(0.1, 5.8, 2.5);
      ctrl.target.set(0, 1.2, 0);
    } else {
      // Close up of waterfall miter edge
      cam.position.set(-2.2, 1.6, 2.0);
      ctrl.target.set(-1.5, 1.1, 0.2);
    }
    ctrl.update();
  };

  return (
    <div className="relative w-full bg-[#0c0d10] text-white overflow-hidden rounded-none border-y border-neutral-800 shadow-2xl">
      {/* 3D WebGL Canvas Viewport */}
      <div 
        ref={mountRef} 
        className="w-full h-[520px] sm:h-[620px] lg:h-[700px] cursor-grab active:cursor-grabbing relative"
        onMouseDown={() => setIsInteractive(true)}
        onTouchStart={() => setIsInteractive(true)}
      />

      {/* Floating 3D HUD: Top Header & Breadcrumbs */}
      <div className="absolute top-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 pointer-events-none z-10">
        <div className="pointer-events-auto bg-black/60 backdrop-blur-md px-4 py-2 border border-white/15 text-xs text-gray-200 flex items-center gap-2 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold tracking-widest uppercase text-white">Live 3D Architectural Studio</span>
          <span className="text-gray-400 hidden sm:inline">| Drag to Rotate • Scroll to Zoom</span>
        </div>

        {/* Camera Angles & Lighting Modes */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Lighting Mode Selector */}
          <div className="flex items-center bg-black/70 backdrop-blur-md p-1 border border-white/15">
            <button
              onClick={() => setLightingMode('daylight')}
              title="Daylight Clean"
              className={`p-1.5 transition ${lightingMode === 'daylight' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingMode('golden')}
              title="Warm Golden Hour"
              className={`p-1.5 transition ${lightingMode === 'golden' ? 'bg-[#c59f60] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingMode('moody')}
              title="Moody Evening"
              className={`p-1.5 transition ${lightingMode === 'moody' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Camera Presets */}
          <div className="hidden sm:flex items-center bg-black/70 backdrop-blur-md p-1 border border-white/15 text-[10px] font-bold uppercase tracking-wider">
            <button
              onClick={() => handleCameraPreset('waterfall')}
              className={`px-2.5 py-1 transition ${cameraView === 'waterfall' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Waterfall Edge
            </button>
            <button
              onClick={() => handleCameraPreset('top')}
              className={`px-2.5 py-1 transition ${cameraView === 'top' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Overhead
            </button>
            <button
              onClick={() => handleCameraPreset('close')}
              className={`px-2.5 py-1 transition ${cameraView === 'close' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Miter Detail
            </button>
          </div>
        </div>
      </div>

      {/* Floating 3D Stone Spec Info Card (Bottom Left) */}
      <div className="absolute bottom-6 left-6 max-w-sm w-full bg-black/85 backdrop-blur-md border border-white/20 p-5 shadow-2xl z-10 hidden sm:block">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c59f60] flex items-center justify-between">
          <span>{activeStone.category} • Selected Spec</span>
          <span>${activeStone.pricePerSqFt} / sq.ft</span>
        </div>
        <h3 className="text-lg font-serif font-bold text-white mt-1">
          {activeStone.name}
        </h3>
        <p className="text-[11px] text-gray-300 mt-1 line-clamp-2 leading-relaxed">
          {activeStone.description}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-[10px] text-gray-300">
          <div>Edge: <strong className="text-white">2&quot; Mitered Waterfall</strong></div>
          <div>Tile: <strong className="text-white">{activeStone.tileStyle}</strong></div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => onBookCallWithSpec(activeStone.name, activeStone.pricePerSqFt)}
            className="flex-1 py-2 bg-white text-black hover:bg-[#c59f60] hover:text-white text-[11px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Call for Spec</span>
          </button>
          <button
            onClick={() => onOpenQuoteModal(activeStone.name)}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold uppercase tracking-wider border border-white/20 transition cursor-pointer"
          >
            Quote
          </button>
        </div>
      </div>

      {/* Floating Material Swatches Dock (Bottom Center / Right) */}
      <div className="absolute bottom-6 right-6 left-6 sm:left-auto flex items-center justify-center sm:justify-end gap-2 z-10 overflow-x-auto no-scrollbar pb-1">
        <div className="bg-black/90 backdrop-blur-md p-2 border border-white/20 flex items-center gap-2 shadow-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 hidden lg:inline">
            Test Slab:
          </span>
          {STONE_PRESETS.map((stone) => {
            const isSelected = activeStone.id === stone.id;
            return (
              <button
                key={stone.id}
                onClick={() => {
                  setActiveStone(stone);
                  setIsRotating(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 transition cursor-pointer border ${
                  isSelected
                    ? 'border-white bg-white text-black shadow-lg scale-105'
                    : 'border-white/20 bg-black/60 text-gray-300 hover:border-white/50'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-black/30 shadow-inner"
                  style={{ backgroundColor: stone.baseColor }}
                />
                <span className="text-xs font-semibold whitespace-nowrap">
                  {stone.name.split(' ')[0]}
                </span>
                {isSelected && <Check className="w-3 h-3 text-black" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
