'use client';

import dynamic from 'next/dynamic';
import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import {
  createScene,
  createCamera,
  createRenderer,
  createRoboticArm,
  animateRoboticArm,
  createFactoryFloor
} from '@/lib/utils/threeUtils';

interface RoboticSceneProps {
  className?: string;
  height?: string;
}

const Scene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    robot: THREE.Group;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Get container dimensions
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Initialize scene
    const scene = createScene();
    const camera = createCamera(width, height);
    const renderer = createRenderer(width, height);
    const currentContainer = containerRef.current;
    currentContainer.appendChild(renderer.domElement);

    // Create and add robot
    const robot = createRoboticArm();
    scene.add(robot);

    // Add factory floor
    const floor = createFactoryFloor();
    scene.add(floor);

    // Store references
    sceneRef.current = { scene, camera, renderer, robot };

    // Animation loop
    let animationFrameId: number;
    const animate = (time: number) => {
      if (!sceneRef.current) return;
      animationFrameId = requestAnimationFrame(animate);
      
      // Animate robot
      if (robot) {
        animateRoboticArm(robot, time * 0.001);
      }

      // Render scene
      renderer.render(scene, camera);
    };

    animate(0);

    // Handle window resize
    const handleResize = () => {
      if (!currentContainer || !sceneRef.current) return;

      const { camera, renderer } = sceneRef.current;
      const width = currentContainer.clientWidth;
      const height = currentContainer.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (currentContainer && renderer) {
        currentContainer.removeChild(renderer.domElement);
      }
      // Clean up Three.js resources
      if (sceneRef.current) {
        sceneRef.current.scene.clear();
        sceneRef.current.renderer.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[400px]"
      style={{ background: 'transparent' }}
    />
  );
};

const RoboticScene: React.FC<RoboticSceneProps> = ({
  className = '',
  height = '100vh'
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Return null on server-side
  }

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