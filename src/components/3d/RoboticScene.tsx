'use client';

import dynamic from 'next/dynamic';
import React, { useRef, useEffect } from 'react';
import { useThreeScene } from '@/hooks/useThreeScene';
import * as THREE from 'three';

interface RoboticSceneProps {
  className?: string;
  height?: string;
}

const createRobot = () => {
  const robotGroup = new THREE.Group();

  // Base
  const baseGeometry = new THREE.CylinderGeometry(0.5, 0.6, 0.3, 32);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a75ff,
    metalness: 0.8,
    roughness: 0.2
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  robotGroup.add(base);

  // Main arm segment
  const arm1Geometry = new THREE.CylinderGeometry(0.15, 0.2, 1.2, 16, 1, false);
  const armMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.9,
    roughness: 0.1
  });
  const arm1 = new THREE.Mesh(arm1Geometry, armMaterial);
  arm1.position.y = 0.75;
  arm1.rotation.z = Math.PI / 6; // Adjust arm angle
  robotGroup.add(arm1);

  // Joint sphere
  const jointGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  const jointMaterial = new THREE.MeshStandardMaterial({
    color: 0x666666,
    metalness: 0.95,
    roughness: 0.1
  });
  const joint1 = new THREE.Mesh(jointGeometry, jointMaterial);
  joint1.position.set(0.3, 1.4, 0);
  robotGroup.add(joint1);

  // Secondary arm segment
  const arm2Geometry = new THREE.CylinderGeometry(0.12, 0.15, 1, 16);
  const arm2 = new THREE.Mesh(arm2Geometry, armMaterial);
  arm2.position.set(0.8, 1.8, 0);
  arm2.rotation.z = Math.PI / 3;
  robotGroup.add(arm2);

  // End effector
  const gripperGroup = new THREE.Group();
  const gripperBaseGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.2);
  const gripperMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.8,
    roughness: 0.2
  });
  const gripperBase = new THREE.Mesh(gripperBaseGeometry, gripperMaterial);
  gripperGroup.add(gripperBase);

  // Gripper fingers
  const fingerGeometry = new THREE.BoxGeometry(0.1, 0.15, 0.05);
  const finger1 = new THREE.Mesh(fingerGeometry, gripperMaterial);
  const finger2 = new THREE.Mesh(fingerGeometry, gripperMaterial);
  finger1.position.set(0.15, -0.15, 0.05);
  finger2.position.set(0.15, -0.15, -0.05);
  gripperGroup.add(finger1);
  gripperGroup.add(finger2);

  gripperGroup.position.set(1.2, 2.1, 0);
  gripperGroup.rotation.z = Math.PI / 4;
  robotGroup.add(gripperGroup);

  return robotGroup;
};

const createConveyorBelt = () => {
  const conveyorGroup = new THREE.Group();

  // Main belt surface
  const beltGeometry = new THREE.BoxGeometry(3, 0.1, 1);
  const beltMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x444444,
    roughness: 0.8,
    metalness: 0.2
  });
  const belt = new THREE.Mesh(beltGeometry, beltMaterial);
  conveyorGroup.add(belt);

  // Rollers
  const rollerGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 16);
  const rollerMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x666666,
    metalness: 0.8,
    roughness: 0.2
  });

  // Add multiple rollers along the conveyor
  for (let i = -1.4; i <= 1.4; i += 0.4) {
    const roller = new THREE.Mesh(rollerGeometry, rollerMaterial);
    roller.rotation.z = Math.PI / 2;
    roller.position.set(i, -0.1, 0);
    conveyorGroup.add(roller);
  }

  // Support legs
  const legGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.1);
  const legMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x222222,
    metalness: 0.7,
    roughness: 0.3
  });

  // Add legs at each corner
  const positions = [
    [-1.4, -0.4, 0.4],
    [-1.4, -0.4, -0.4],
    [1.4, -0.4, 0.4],
    [1.4, -0.4, -0.4]
  ];

  positions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(x, y, z);
    conveyorGroup.add(leg);
  });

  return conveyorGroup;
};

const Scene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Three.js scene with custom hook
  const { sceneReady } = useThreeScene({
    containerRef,
    mouseMove: true,
    scrollAnimation: true
  });

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

const RoboticScene: React.FC<RoboticSceneProps> = ({
  className = '',
  height = '100vh'
}) => {
  return (
    <div 
      className={`relative w-full h-screen ${className}`}
      style={{ height }}
    >
      <Scene />
      
      {/* Main headline */}
      <div className="absolute top-1/3 left-10 transform -translate-y-1/2 z-20 max-w-xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Next-Gen <span className="text-blue-400">Automation</span> & <span className="text-blue-400">Robotics</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          Revolutionize your manufacturing with cutting-edge robotics and intelligent automation systems.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Explore Solutions
        </button>
      </div>
      
      {/* Universal Robot Label */}
      <div className="absolute bottom-10 right-10 z-20 bg-black/50 backdrop-blur-sm p-3 rounded-lg border border-blue-500/30">
        <div className="text-blue-400 font-mono text-sm">Universal Robot UR10e</div>
        <div className="text-xs text-gray-400">6-axis industrial automation</div>
      </div>
    </div>
  );
};

// Export as dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(RoboticScene), {
  ssr: false
});