'use client';

import React, { useRef, useEffect } from 'react';
import { useThreeScene } from '@/hooks/useThreeScene';
import { createConveyorBelt } from '@/lib/utils/threeUtils';
import { gsap } from 'gsap';

interface RoboticSceneProps {
  className?: string;
  height?: string;
}

const RoboticScene: React.FC<RoboticSceneProps> = ({
  className = '',
  height = '100vh'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const conveyorRef = useRef<THREE.Group | null>(null);

  // Initialize Three.js scene with custom hook
  const { scene, sceneReady, roboticArm } = useThreeScene({
    containerRef,
    mouseMove: true,
    scrollAnimation: true
  });

  // Add conveyor belt to scene when ready
  useEffect(() => {
    if (scene && sceneReady && !conveyorRef.current) {
      const conveyor = createConveyorBelt();
      conveyor.position.set(0, -2, -2);
      scene.add(conveyor);
      conveyorRef.current = conveyor;

      // Add animation for conveyor
      const animateConveyor = () => {
        if (conveyorRef.current) {
          // Rotate rollers to simulate movement
          if (conveyorRef.current.children[2]) { // First roller
            conveyorRef.current.children[2].rotation.x += 0.01;
          }
          if (conveyorRef.current.children[3]) { // Second roller
            conveyorRef.current.children[3].rotation.x += 0.01;
          }
        }
        requestAnimationFrame(animateConveyor);
      };
      
      animateConveyor();
    }
  }, [scene, sceneReady]);

  // Add floating holographic UI elements
  useEffect(() => {
    if (containerRef.current && sceneReady) {
      // Create floating UI elements using DOM
      const ui = document.createElement('div');
      ui.className = 'absolute top-1/4 right-10 p-4 bg-black/20 backdrop-blur-md rounded-lg border border-blue-500/30 text-blue-400 font-mono text-xs z-10 transform transition-all duration-500';
      ui.innerHTML = `
        <div class="mb-2 font-bold text-blue-300">SYSTEM STATUS</div>
        <div class="grid grid-cols-2 gap-x-4 gap-y-1">
          <div>Robot Arm:</div>
          <div class="text-green-400">ACTIVE</div>
          <div>Conveyor:</div>
          <div class="text-green-400">RUNNING</div>
          <div>Power:</div>
          <div class="text-green-400">98.7%</div>
          <div>Efficiency:</div>
          <div class="text-yellow-400">87.3%</div>
        </div>
        <div class="mt-3 h-1 bg-blue-900/50 rounded overflow-hidden">
          <div class="h-full bg-blue-500 rounded" style="width: 87%"></div>
        </div>
      `;
      
      containerRef.current.appendChild(ui);
      
      // Add floating data points that appear on hover near the robotic arm
      const dataPoint = document.createElement('div');
      dataPoint.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300';
      dataPoint.innerHTML = `
        <div class="w-4 h-4 bg-red-500 rounded-full animate-ping absolute"></div>
        <div class="w-2 h-2 bg-red-500 rounded-full absolute top-1 left-1"></div>
      `;
      
      containerRef.current.appendChild(dataPoint);
      
      // Show data points on hover
      containerRef.current.addEventListener('mouseover', () => {
        gsap.to(dataPoint, { opacity: 1, duration: 0.3 });
      });
      
      containerRef.current.addEventListener('mouseout', () => {
        gsap.to(dataPoint, { opacity: 0, duration: 0.3 });
      });

      // Cleanup
      return () => {
        if (containerRef.current) {
          if (ui.parentNode === containerRef.current) {
            containerRef.current.removeChild(ui);
          }
          if (dataPoint.parentNode === containerRef.current) {
            containerRef.current.removeChild(dataPoint);
          }
        }
      };
    }
  }, [sceneReady]);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Three.js scene container */}
      <div 
        ref={containerRef} 
        className="w-full h-full"
      />
      
      {/* Overlay gradient for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
      
      {/* Main headline */}
      <div className="absolute top-1/3 left-10 transform -translate-y-1/2 z-10 max-w-xl">
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
    </div>
  );
};

export default RoboticScene;