import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, Maximize2, Move } from 'lucide-react';

// Create different tile geometries based on profile
const createTileGeometry = (profileId) => {
  const geometry = new THREE.Group();
  
  switch (profileId) {
    case 'legendary-slate':
    case 'new-england-slate':
    case 'yorkshire-slate':
      // Slate tiles - flat with beveled edges
      const slateShape = new THREE.Shape();
      slateShape.moveTo(0, 0);
      slateShape.lineTo(1.2, 0);
      slateShape.lineTo(1.15, 1.8);
      slateShape.lineTo(0.05, 1.8);
      slateShape.lineTo(0, 0);
      
      const extrudeSettings = {
        steps: 1,
        depth: 0.08,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 2
      };
      
      const slateMesh = new THREE.Mesh(
        new THREE.ExtrudeGeometry(slateShape, extrudeSettings),
        new THREE.MeshStandardMaterial()
      );
      geometry.add(slateMesh);
      break;
      
    case 'legendary-split-timber':
    case 'split-timber':
    case 'yorkshire-split-timber':
      // Wood shake - textured with splits
      const shakeBase = new THREE.BoxGeometry(1.2, 1.8, 0.12);
      const shakeMesh = new THREE.Mesh(
        shakeBase,
        new THREE.MeshStandardMaterial()
      );
      
      // Add texture detail
      for (let i = 0; i < 3; i++) {
        const split = new THREE.Mesh(
          new THREE.BoxGeometry(0.02, 1.8, 0.13),
          new THREE.MeshStandardMaterial({ color: 0x333333 })
        );
        split.position.x = (Math.random() - 0.5) * 1.0;
        geometry.add(split);
      }
      
      geometry.add(shakeMesh);
      break;
      
    case 'sierra-mission':
      // Mission tile - high barrel S-curve
      const missionCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.3, 0, 0.15),
        new THREE.Vector3(0.6, 0, 0.18),
        new THREE.Vector3(0.9, 0, 0.12),
        new THREE.Vector3(1.2, 0, 0)
      ]);
      
      const missionShape = new THREE.Shape();
      const points = missionCurve.getPoints(50);
      missionShape.moveTo(points[0].x, points[0].z);
      points.forEach(p => missionShape.lineTo(p.x, p.z));
      missionShape.lineTo(1.2, 0);
      missionShape.lineTo(0, 0);
      
      const missionMesh = new THREE.Mesh(
        new THREE.ExtrudeGeometry(missionShape, { 
          steps: 20, 
          depth: 1.8, 
          bevelEnabled: false 
        }),
        new THREE.MeshStandardMaterial()
      );
      missionMesh.rotation.x = Math.PI / 2;
      geometry.add(missionMesh);
      break;
      
    case 'european':
      // European - double barrel
      const euro1Curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.3, 0, 0.15),
        new THREE.Vector3(0.6, 0, 0)
      );
      const euro2Curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0.6, 0, 0),
        new THREE.Vector3(0.9, 0, 0.15),
        new THREE.Vector3(1.2, 0, 0)
      );
      
      const euroShape = new THREE.Shape();
      const euro1Points = euro1Curve.getPoints(25);
      const euro2Points = euro2Curve.getPoints(25);
      
      euroShape.moveTo(0, 0);
      euro1Points.forEach(p => euroShape.lineTo(p.x, p.z));
      euro2Points.forEach(p => euroShape.lineTo(p.x, p.z));
      euroShape.lineTo(1.2, 0);
      euroShape.lineTo(0, 0);
      
      const euroMesh = new THREE.Mesh(
        new THREE.ExtrudeGeometry(euroShape, { 
          steps: 20, 
          depth: 1.8, 
          bevelEnabled: false 
        }),
        new THREE.MeshStandardMaterial()
      );
      euroMesh.rotation.x = Math.PI / 2;
      geometry.add(euroMesh);
      break;
      
    default:
      // Default flat tile
      const defaultMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.8, 0.1),
        new THREE.MeshStandardMaterial()
      );
      geometry.add(defaultMesh);
  }
  
  return geometry;
};

// Apply texture based on selection
const applyTexture = (material, textureId, color) => {
  // Base color
  material.color = new THREE.Color(color || '#666666');
  
  // Texture modifications
  switch (textureId) {
    case 'vintage':
      material.roughness = 0.95;
      material.metalness = 0.1;
      // Add slight color variation for aged look
      break;
      
    case 'swirl-brush':
      material.roughness = 0.85;
      material.metalness = 0.05;
      break;
      
    case 'straight-brush':
      material.roughness = 0.8;
      material.metalness = 0.05;
      break;
      
    case 'cobblestone':
      material.roughness = 0.95;
      material.metalness = 0;
      break;
      
    case 'signature-slate':
      material.roughness = 0.75;
      material.metalness = 0.15;
      break;
      
    default: // standard
      material.roughness = 0.7;
      material.metalness = 0.1;
  }
};

export default function TileViewer3D({ config }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const tileRef = useRef(null);
  const animationRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);
  const mouseDown = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(2, 1.5, 3);
    camera.lookAt(0.6, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xc9a962, 0.3);
    fillLight.position.set(-3, 2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(0, 3, -5);
    scene.add(rimLight);

    // Grid/Platform
    const gridHelper = new THREE.GridHelper(4, 20, 0x333333, 0x1a1a1a);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // Platform for tile
    const platformGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.05, 32);
    const platformMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      roughness: 0.8,
      metalness: 0.2
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -0.5;
    platform.receiveShadow = true;
    scene.add(platform);

    // Mouse controls
    const handleMouseDown = (e) => {
      mouseDown.current = true;
      mousePos.current = { x: e.clientX, y: e.clientY };
      setIsRotating(false);
    };

    const handleMouseMove = (e) => {
      if (!mouseDown.current || !tileRef.current) return;
      
      const deltaX = e.clientX - mousePos.current.x;
      const deltaY = e.clientY - mousePos.current.y;
      
      tileRef.current.rotation.y += deltaX * 0.01;
      tileRef.current.rotation.x += deltaY * 0.01;
      
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      mouseDown.current = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY * 0.001;
      camera.position.z = Math.max(2, Math.min(6, camera.position.z + delta));
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (tileRef.current && isRotating) {
        tileRef.current.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update tile when config changes
  useEffect(() => {
    if (!sceneRef.current || !config.profile) return;

    // Remove old tile
    if (tileRef.current) {
      sceneRef.current.remove(tileRef.current);
    }

    // Create new tile
    const tileGroup = createTileGeometry(config.profile.id);
    tileGroup.position.set(-0.6, 0, -0.9);
    tileGroup.castShadow = true;
    tileGroup.receiveShadow = true;

    // Apply color and texture to all meshes
    tileGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        applyTexture(child.material, config.texture?.id || 'standard', config.color?.hex || '#666666');
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    sceneRef.current.add(tileGroup);
    tileRef.current = tileGroup;
  }, [config.profile, config.color, config.texture]);

  const resetView = () => {
    if (tileRef.current) {
      tileRef.current.rotation.set(0, 0, 0);
    }
    if (cameraRef.current) {
      cameraRef.current.position.set(2, 1.5, 3);
      cameraRef.current.lookAt(0.6, 0, 0);
    }
    setIsRotating(true);
  };

  const toggleRotation = () => {
    setIsRotating(prev => !prev);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={toggleRotation}
          className={`w-10 h-10 rounded-xl backdrop-blur-sm flex items-center justify-center transition-all ${
            isRotating 
              ? 'bg-[#c9a962]/20 text-[#c9a962] ring-1 ring-[#c9a962]/30' 
              : 'bg-black/60 text-white/70 hover:text-white hover:bg-black/80'
          }`}
          title={isRotating ? 'Stop Auto-Rotation' : 'Start Auto-Rotation'}
        >
          <RotateCcw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
        </button>
        <button
          onClick={resetView}
          className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center">
        <div className="bg-black/80 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Move className="w-3 h-3" />
            <span>Drag to rotate • Scroll to zoom</span>
          </div>
        </div>
      </div>

      {/* Config Info */}
      {config.profile && (
        <div className="absolute top-4 left-4">
          <div className="bg-black/80 backdrop-blur-xl rounded-xl p-3 border border-white/10 max-w-xs">
            <div className="flex items-center gap-3">
              {config.color && (
                <div 
                  className="w-10 h-10 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: config.color.hex }}
                />
              )}
              <div>
                <p className="text-white font-medium text-sm">{config.profile.name}</p>
                <p className="text-white/50 text-xs">
                  {config.texture?.name || 'Standard'} • {config.color?.name || 'No color'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!config.profile && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
          <div className="text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Maximize2 className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-xl font-light text-white mb-2">3D Tile Preview</h3>
            <p className="text-white/50 text-sm max-w-xs mx-auto">
              Select a tile profile to view it in 3D
            </p>
          </div>
        </div>
      )}
    </div>
  );
}